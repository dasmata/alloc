import config from '../config/acl.js'

export default class Acl {
  constructor(identityService) {
    this.config = config;
    this.identityService = identityService;
  }

  isAllowed(route) {
    const userRights = this.identityService.getUserRights();
    const requiredRights = this.config.routes[route] || this.config.defaultRights;
    return typeof requiredRights === 'function'
      ? requiredRights(this)
      : requiredRights & userRights;
  }
}
