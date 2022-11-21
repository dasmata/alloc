export default {
  roles: [
    {
      name: 'anon',
      value: 1
    },
    {
      name: 'user',
      value: 2
    }
  ],
  defaultRights: 2,
  routes: {
    [Symbol.for('login')]: aclService => !aclService.identityService.isAuth()
  }
}
