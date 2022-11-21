import { jest, expect } from '@jest/globals';

import HttpSequence from '../../src/utils/HttpSequence.js';

describe('HttpSequence', () => {
  let seq;
  const httpServ = {
    request: jest.fn().mockReturnValue(Promise.resolve('request')),
    get: jest.fn().mockReturnValue(Promise.resolve('get')),
    post: jest.fn().mockReturnValue(Promise.resolve('post')),
    put: jest.fn().mockReturnValue(Promise.resolve('put')),
    patch: jest.fn().mockReturnValue(Promise.resolve('patch')),
    delete: jest.fn().mockReturnValue(Promise.resolve('delete')),
  }

  beforeEach(() => {
    seq = new HttpSequence(httpServ)
  })

  it('forwards methods', async () => {
    const path = 'path';
    const httpMethods = ['post', 'get', 'patch', 'put', 'delete'];

    httpMethods.forEach(method => {
      seq[method](path);
    })
    const { promise } = seq.run();
    await promise;

    httpMethods.forEach(method => {
      expect(httpServ[method]).toHaveBeenCalledTimes(1)
      expect(httpServ[method]).toHaveBeenCalledWith(path)
    })
  });


  it('it aborts on request', async () => {
    seq.get('test');
    const { abort, promise } = seq.run();
    abort();
    await promise;
    expect(seq.aborted).toBeTruthy();
  });

  it('throws on requests after abort', async () => {
    seq.abort();
    await expect(seq.request()).rejects.toBeInstanceOf(Error)
  });

  it('aborts after failed request', async () => {
    httpServ.request.mockImplementation(() => {
      return Promise.reject('rejected')
    })
    httpServ.get.mockImplementation(function(...params) {
      return seq.request(...params)
    });
    seq.get('test');
    seq.get('test2');
    try{
      const { promise } = seq.run()
      const result = await promise;
      expect(result[0]).toBe('rejected');
      expect(result[1]).toBeUndefined();
    } catch (e) {
      console.log('bbb', e)
    }
    await expect(seq.request('get', 'test')).rejects.toBeInstanceOf(Error)
    expect(httpServ.request).toHaveBeenCalledTimes(1)
  });
});
