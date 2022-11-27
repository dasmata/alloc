export default class Identity {
  constructor(httpService, logService){
    this.user = localStorage.identity ? JSON.parse(localStorage.identity) : null;
    this.httpService = httpService;
    this.logService = logService;
  }

  isAuth() {
    return this.user !== null;
  }

  auth(data) {
    const s = this.httpService.sequence();
    const prm = s.post('user/login', data);
    prm.then(userData => {
      this.user = userData;
      localStorage.identity = JSON.stringify(this.user);
      return this.user;
    })
    const { abort, promise } = s.run();
    return {
      abort,
      promise: new Promise(async (resolve, reject) => {
        const results = await promise;
        if(results[0] instanceof Error){
          reject(results[0]);
        } else {
          resolve(results[0]);
        }
      })
    }
  }

  getUserToken() {
    return this.user?.token || '';
  }

  getUserRights(){
    return this.user?.rights || 1
  }
}
