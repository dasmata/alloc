import config from '../config/acl.js'

export default class Acl {
  constructor(identityService) {
    this.config = config;
    this.identityService = identityService;
  }

  isAllowed(route) {
    return this.config.routes[route]
      ? this.config.routes[route] & this.identityService.getUserRights()
      : this.config.defaultRights;
  }
}
