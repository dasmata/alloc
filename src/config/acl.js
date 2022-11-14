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
  defaultRights: 0,
  routes: {
    [Symbol.for('login')]: 1
  }
}
