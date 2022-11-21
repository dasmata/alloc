import routes from '../config/routes.js';

export default class Router {
  constructor(app, acl){
    this.config = routes;
    this.app = app;
    this.acl = acl;
  }

  async init () {
    const currentRoute = Object.getOwnPropertySymbols(this.config).filter(symbol => {
      const route = this.config[symbol];
      const reg = new RegExp(`${route.path}`);
      return window.location.pathname.match(reg) !== null;
    })
    this.redirect(currentRoute.pop())
  }

  async redirect(name, params){
    const routeName = typeof name === 'symbol' ? name : Symbol.for(name)
    const route = this.config[routeName];
    if(this.acl.isAllowed(routeName)){
      await this.app.setPage(await Router.load(route, params))
      if(route?.path){
        window.history.pushState(params, '', route.path)
      }
    } else {
      // prevent infinite loop redirect
      Symbol.keyFor(routeName) !== 'login' && await this.redirect(Symbol.for('login'), {redirect: Symbol.keyFor(routeName) })
    }
  }

  static async load(route){
    if(route){
      return route.page().then(tagName => document.createElement(tagName))
    }
    console.error('404 - not found')
    return null
  }
}
