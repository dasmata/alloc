import HttpResponseError from '../errors/HttpResponseError';
import HttpSequence from '../utils/HttpSequence';
import config from '../config/api.js'

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
    return `${config.secure ? 'https' : 'http'}://${config.host}:${config.port}/v${config.version}/${path}`
  }

  request(method, path, data = null, signal = null){
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
    });
  }

  get(path) {
    return this.request('get', path)
  }

  post(path, data) {
    return this.request('post', path, HttpService.getFormData(data))
  }

  patch(path, data) {

  }

  delete(path) {

  }

  sequence(id = null){
    return new HttpSequence(this, id);
  }
}
