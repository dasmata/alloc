export default {
  [Symbol.for('home')]: {
    path: '/',
    page: async () => import('../pages/HomePage.js').then(() => 'home-page')
  },
  [Symbol.for('login')]: {
    path: '/login',
    page: async () => import('../pages/Login/LoginPage.js').then(() => 'login-page')
  }
}
