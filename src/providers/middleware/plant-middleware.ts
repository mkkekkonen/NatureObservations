import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as moment from 'moment';
import Plant from '../../models/plant/Plant';
import { basePath } from './middleware';
import { Observable } from 'rxjs/Observable';

export const parsePlant = (jsonPlant): Plant => {
  return new Plant(
    jsonPlant.id,
    jsonPlant.name,
    jsonPlant.latinname,
    moment(jsonPlant.updated),
  );
};

@Injectable()
export class PlantMiddlewareProvider {

  constructor(public http: HttpClient) {
    console.log('Hello PlantMiddlewareProvider Provider');
  }

  getPlants(): Observable<any> {
    return this.http.get(`${basePath}/getspecies.php`);
  }
}
