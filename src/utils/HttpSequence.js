export default class HttpSequence {
  constructor(httpService, sequenceId = null) {
    this.httpService = httpService;
    this.sequenceId = sequenceId ?? Symbol('sequence');
    this.controller = new AbortController();
    this.aborted = false;
    this.ops = new Map();
    const sequence = this;
    return new Proxy(httpService, {
      get(target, p) {
        if(typeof sequence[p] !== 'undefined'){
          return sequence[p];
        }
        return (...args) => {
          return sequence.addOp(p, [...args]);
        }
      }
    });
  }

  request(...args){
    if (this.aborted) {
      return Promise.reject(new Error('Aborted'));
    }
    const signal = this.controller.signal;
    const prm = this.httpService.request(...args, signal)
    prm.catch((e) => {
      if(!this.aborted){
        this.abort();
      }
      return Promise.reject(e);
    });
    return prm;
  }

  abort = () => {
    this.controller.abort();
    this.aborted = true;
  }

  addOp(method, params){
    const operationId = Symbol('operation');
    let prm = null
    const ops = []
    this.ops.set(operationId, {
      method,
      params,
      callback: opPromise => {
        prm = opPromise;
        ops.forEach((op) => {
          prm[op.method](...op.params);
        })
      }
    });
    const proxy = new Proxy({}, {
      get (target, p) {
        return (...args) => {
          if (prm) {
            return prm[p](...args)
          }
          ops.push({
            method: p,
            params: args
          })
          return proxy;
        }
      }
    });
    return proxy;
  }

  run = () => {
    let chain = null
    const results = [];
    const getOpPromise = (operation) => {
      return this.httpService[operation.method].apply(this, operation.params)
        .then((data) => {
          results.push(data);
          return data;
        }).catch(e => {
          results.push(e)
          return e;
        })
    }
    this.ops.forEach(operation => {
      if (chain) {
        chain.then(
          () => getOpPromise(operation)
        )
      } else {
        chain = getOpPromise(operation)
      }
      operation.callback(chain);
    })
    return {
      abort: this.abort,
      promise: new Promise(r => {
        chain.then(() => r(results));
        chain.catch(() => r(results));
      })
    }
  }
}
