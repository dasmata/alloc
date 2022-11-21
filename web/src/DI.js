import config from './services/index'

const mutableProxy = function () {
  let mutableTarget;
  let mutableHandler;

  function setTarget(target) {
    if (!(target instanceof Object)) {
      throw new Error(`Target "${target}" is not an object`);
    }
    mutableTarget = target;
  }

  function setHandler(handler) {
    Object.keys(handler).forEach(key => {
      const value = handler[key];

      if (typeof value !== 'function') {
        throw new Error(`Trap "${key}: ${value}" is not a function`);
      }

      if (!Reflect[key]) {
        throw new Error(`Trap "${key}: ${value}" is not a valid trap`);
      }
    });
    mutableHandler = handler;
  }

  function mutableProxyFactory() {
    setTarget(() => {});
    setHandler(Reflect);

    // Dynamically forward all the traps to the associated methods on the mutable handler
    const handler = new Proxy({}, {
      get(target, property) {
        return (...args) => mutableHandler[property].apply(null, [mutableTarget, ...args.slice(1)]);
      }
    });

    return {
      setTarget,
      setHandler,
      getTarget() {
        return mutableTarget;
      },
      getHandler() {
        return mutableHandler;
      },
      proxy: new Proxy(mutableTarget, handler)
    };
  }

  return mutableProxyFactory;
};



class DI {
  constructor(app){
      this.instances = {};
      this.app = app;
      this.pending = new Set();
  }

  async getParams(params) {
    return Promise.all(params.map(el => {
      if(typeof el === 'symbol'){
        return this.getService(el)
      }
      switch(el){
        case '@App':
          return Promise.resolve(this.app)
        default:
          return el
      }
    }))
  }

  async getService(name){
    const key = typeof name === 'symbol' ? name : Symbol.for(name);
    if(!this.instances[key]){
      this.pending.add(key)
      this.instances[key] = config[key].constructor().then(async module => {
        const ServiceConstructor = module.default;
        const params = await this.getParams(config[key].params)
        this.pending.delete(key);
        return new ServiceConstructor(...params)
      });
    } else if(this.instances[key] && this.pending.has(key)){
      // fix circular dependencies by creating a proxy object for the requested service
      const {
        proxy,
        setTarget,
        setHandler
      } = mutableProxy()();
      // set the target of the proxy to be the request promise
      setTarget(this.instances[key])
      // set a handler for that promise
      setHandler({
          get: (target, prop) => {
            if(prop === 'then'){
              target.then.bind(target)
            }
          }
      })

      this.instances[key].then((service) => {
        // the actual service finishes loading replace the target of the proxy to be the loaded service
        // and set the handler to just forward requests
        setTarget(service)
        setHandler(Reflect)
        return service;
      })
      return proxy;
    }
    return this.instances[key];
  }
}

let di = null

export default function(name) {
  if(!name){
    return {
      init (app) {
        return di || (di = new DI(app))}
    }
  }
  return di?.getService(name);
}
