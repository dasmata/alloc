import config from '../config/acl.js'

export default class Acl {
  constructor(identityService) {
    this.config = config;
    this.identityService = identityService;
  }

  isAllowed(route) {
    const userRights = this.identityService.getUserRights();
    if (this.config.routes[route]) {
      return typeof this.config.routes[route] === 'function'
        ? this.config.routes[route](this)
        : this.config.routes[route] & userRights;
    }
    return this.config.defaultRights & userRights;
  }
}
