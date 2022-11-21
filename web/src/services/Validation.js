export default class Validation {

  async empty(value) {
    return value !== '' && value !== null && value !== undefined && value !== false;
  }

  async email(value) {
    return value.match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/) !== null;
  }
}
