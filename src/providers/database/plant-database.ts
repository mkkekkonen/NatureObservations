import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { flatten } from 'lodash';

import { DB_FILE_NAME, DB_LOCATION } from './database';
import Plant from '../../models/plant/Plant';

export const formulatePlantSql = (plants: Plant[]) => {
  let insertReplaceSql = 'INSERT OR REPLACE INTO plants\n';
  insertReplaceSql += '(id, name, latinname, updated) VALUES\n';
  const jaggedArray = plants.map((plant) => {
    insertReplaceSql += '(?, ?, ?, ?),\n';
    return [plant.id, plant.name, plant.latinName, plant.updated.format()];
  });
  const flattenedArray = flatten(jaggedArray);
  insertReplaceSql = insertReplaceSql.substring(0, insertReplaceSql.length - 2);
  return { flattenedArray, insertReplaceSql };
};

@Injectable()
export class PlantDatabaseProvider {

  constructor(public http: HttpClient, private sqlite: SQLite) {
    console.log('Hello PlantDatabaseProvider Provider');
  }

  public updateUpdated() {
    this.sqlite.create({
      name: DB_FILE_NAME,
      location: DB_LOCATION,
    }).then((db: SQLiteObject) => {
      const createSql = 'CREATE TABLE IF NOT EXISTS last_updated (last_updated TEXT);';
      db.executeSql(createSql, [])
        .then(() => console.log('Success'))
        .catch(error => console.log(`Error: ${JSON.stringify(error)}`));
      const deleteSql = 'DELETE FROM last_updated';
      db.executeSql(deleteSql, [])
        .then(() => console.log('Success'))
        .catch(error => console.log(`Error: ${JSON.stringify(error)}`));
      const insertSql = 'INSERT INTO last_updated (last_updated) VALUES (datetime(\'now\'))';
      db.executeSql(insertSql, [])
        .then(() => console.log('Success'))
        .catch(error => console.log(`Error: ${JSON.stringify(error)}`));
    });
  }

  public updatePlants(plants: Plant[]) {
    this.sqlite.create({
      name: DB_FILE_NAME,
      location: DB_LOCATION,
    }).then((db: SQLiteObject) => {
      let createSql = 'CREATE TABLE IF NOT EXISTS plants\n';
      createSql += '(id INTEGER PRIMARY KEY, name TEXT, latinname TEXT, updated TEXT)';
      db.executeSql(createSql, [])
        .then(() => console.log('Success'))
        .catch(error => console.log(`Error: ${JSON.stringify(error)}`));

      const { insertReplaceSql, flattenedArray } = formulatePlantSql(plants);
      db.executeSql(insertReplaceSql, flattenedArray)
        .then(() => console.log('Success'))
        .catch(error => console.log(`Error: ${JSON.stringify(error)}`));
    });
  }
}
