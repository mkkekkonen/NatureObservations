import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import 'whatwg-fetch';
import * as plantMiddleware from './plant-middleware';

export const basePath = 'http://192.168.10.20/mobiilikasvio';

@Injectable()
export class MiddlewareProvider {

  constructor(public http: HttpClient) {
    console.log('Hello MiddlewareProvider Provider');
  }
}
