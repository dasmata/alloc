import HttpResponseError from '../errors/HttpResponseError';
import HttpSequence from '../utils/HttpSequence';

export default class HttpService {

  constructor(identity){
    this.identityService = identity;
  }

  static getFormData(obj, formData = new FormData()){
    const createFormData = function(obj, subKeyStr = ''){
      for(let i in obj){
        let value = obj[i];
        let subKeyStrTrans = subKeyStr ? subKeyStr + '[' + i + ']' : i;

        if(typeof(value) === 'string' || typeof(value) === 'number'){
          formData.append(subKeyStrTrans, value);
        } else if(typeof(value) === 'object'){
          createFormData(value, subKeyStrTrans);
        }
      }
    }
    createFormData(obj);

    return formData;
  }

  getHeaders() {
    return {
      'Authorization': `Bearer ${this.identityService.getUserToken()}`,
      'Content-Type': 'application/json'
    }
  }

  getUrl(path){
    // config or smth
    return `http://localhost:8000${path}`
  }

  async request(method, path, data = null, signal = null){
    const options = {
      signal,
      method,
      header: this.getHeaders()
    }
    if(['put', 'patch', 'post'].includes(method)){
      options.body = data || null;
    }
    const prm = fetch(this.getUrl(path), )
    return prm.then(response => {
      if( response.ok ){
        return response.json();
      }
      return Promise.reject(new HttpResponseError(response))
    })
  }

  async get(path) {
    return this.request('get', path)
  }

  async post(path, data) {
    return this.request('post', path, HttpService.getFormData(data))
  }

  async patch(path, data) {

  }

  async delete(path) {

  }

  sequence(id = null){
    return new HttpSequence(this, id);
  }
}
