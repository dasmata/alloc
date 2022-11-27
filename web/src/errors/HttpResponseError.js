export default class HttpResponseError extends Error {
  constructor(response) {
    super('HttpResponseError');
    this.response = response;
    this.name = 'HttpResponseError';
  }
}
