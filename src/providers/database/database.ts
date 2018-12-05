import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';

export const DB_FILE_NAME = 'database.db';
export const DB_LOCATION = 'default';

@Injectable()
export class DatabaseProvider {

  constructor(public http: HttpClient, private sqlite: SQLite) {
    console.log('Hello DatabaseProvider Provider');
  }

  public createTables() {
    this.sqlite.create({
      name: DB_FILE_NAME,
      location: DB_LOCATION,
    }).then((db: SQLiteObject) => {
      const dbVersion = localStorage.getItem('nobs_dbversion');
      if (!dbVersion || dbVersion === '') {
        localStorage.setItem('nobs_dbversion', '1');

        db.transaction((tx) => {
          let observationSql = 'CREATE TABLE IF NOT EXISTS observations\n';
          observationSql += '(id INTEGER PRIMARY KEY, type TEXT, ';
          observationSql += 'date TEXT, description TEXT)';
          tx.executeSql(observationSql, [],
                        () => console.log('Created observation table'),
                        (tx, error) => console.log(`Error: ${error.message}`));

          let mapLocationSql = 'CREATE TABLE IF NOT EXISTS maplocations\n';
          mapLocationSql += '(id INTEGER PRIMARY KEY, name TEXT, ';
          mapLocationSql += 'latitude REAL, longitude REAL, ';
          mapLocationSql += 'observationid INTEGER REFERENCES observations(id) ON DELETE CASCADE)';
          tx.executeSql(mapLocationSql, [],
                        () => console.log('Created map location table'),
                        (tx, error) => console.log(`Error: ${error.message}`));

          let imageSql = 'CREATE TABLE IF NOT EXISTS imgdata\n';
          imageSql += '(id INTEGER PRIMARY KEY, fileuri TEXT, debugdatauri TEXT, ';
          imageSql += 'observationid INTEGER REFERENCES observations(id) ON DELETE CASCADE)';
          tx.executeSql(imageSql, [],
                        () => console.log('Created image table'),
                        (tx, error) => console.log(`Error: ${error.message}`));
        });
      }
    });
  }

  public nukeDb() {
    localStorage.setItem('nobs_dbversion', '');

    this.sqlite.create({
      name: DB_FILE_NAME,
      location: DB_LOCATION,
    }).then((db: SQLiteObject) => {
      db.transaction((tx) => {
        const mapLocationSql = 'DROP TABLE maplocations';
        tx.executeSql(mapLocationSql, [],
                      () => console.log('Dropped map location table'),
                      (tx, error) => console.log(`Error: ${error.message}`));

        const imgDataSql = 'DROP TABLE imgdata';
        tx.executeSql(imgDataSql, [],
                      () => console.log('Dropped image data table'),
                      (tx, error) => console.log(`Error: ${error.message}`));

        const observationSql = 'DROP TABLE observations';
        tx.executeSql(observationSql, [],
                      () => console.log('Dropped observation table'),
                      (tx, error) => console.log(`Error: ${error.message}`));
      });

      window.alert('Done');
    });
  }
}
