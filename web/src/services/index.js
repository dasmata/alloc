export default {
  [Symbol.for('identity')]: {
    constructor: async () => import('./Identity.js'),
    params: [Symbol.for('http'), Symbol.for('log')]
  },
  [Symbol.for('router')]: {
    constructor: async () => import('./Router.js'),
    params: ['@App', Symbol.for('acl')]
  },
  [Symbol.for('acl')]: {
    constructor: async () => import('./Acl.js'),
    params: [Symbol.for('identity')]
  },
  [Symbol.for('validation')]: {
    constructor: async () => import('./Validation.js'),
    params: []
  },
  [Symbol.for('http')]: {
    constructor: async () => import('./HttpService.js'),
    params: [Symbol.for('identity')]
  },
  [Symbol.for('log')]: {
    constructor: async () => import('./LogService.js'),
    params: []
  }
}
