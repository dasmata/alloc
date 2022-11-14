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
        return (...args) => sequence.addOp(p, [...args]);
      }
    });
  }

  async request(...args){
    if (this.aborted) {
      return Promise.reject(new Error('Aborted'));
    }
    const signal = this.controller.signal;
    const prm = this.httpService.request(...args, signal)
    prm.catch(() => {
      if(!this.aborted){
        this.abort();
      }
    })
    return prm;
  }

  abort(){
    this.controller.abort();
    this.aborted = true;
  }

  async addOp(method, params){
    const operationId = Symbol('operation');
    let prm = null
    this.ops.set(operationId, {
      method,
      params,
      callback: opPromise => {
        prm = opPromise;
      }
    });
    return new Proxy({}, {
      get: (target, p) => {
        return (...args) => prm[p](...args)
      }
    })
  }

  run() {
    const prms = [];
    this.ops.forEach(operation => {
      const prm = this.httpService[operation.method].apply(this, operation.params);
      operation.callback(prm);
      prms.push(prm)
    })
    return {
      abort: this.abort.bind(this),
      promise: Promise.all(prms)
    }
  }
}
