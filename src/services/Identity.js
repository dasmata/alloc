export default class Identity {
  constructor(httpService, logService){
    this.identity = null;
    this.user = null;
    this.httpService = httpService;
    this.logService = logService;
  }

  isAuth() {
    return this.identity !== null;
  }

  auth(data) {
    const s = this.httpService.sequence();
    const prm = s.post('/api/login.json', data);
    prm.then(userData => {
       const data = userData ?? {
           name: 'Tibi',
           token: 'vsfbsdndh,fdhew45yegfewqfvebnrbwbretnt',
           rights: 3
         }
      this.user = data;
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
