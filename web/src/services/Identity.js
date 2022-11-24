export default class Identity {
  constructor(httpService, logService){
    this.user = null;
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
      return this.user;
    }).catch(e => {
      this.logService.warn(e)
    })
    return s.run();
  }

  getUserToken() {
    return this.user?.token || '';
  }

  getUserRights(){
    return this.user?.rights || 1
  }
}
