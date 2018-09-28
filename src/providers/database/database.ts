import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

export const DB_FILE_NAME = 'database.db';
export const DB_LOCATION = 'default';

@Injectable()
export class DatabaseProvider {

  constructor(public http: HttpClient) {
    console.log('Hello DatabaseProvider Provider');
  }
}
