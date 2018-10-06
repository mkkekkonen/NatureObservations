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
      if (!localStorage.getItem('dbversion')) {
        localStorage.setItem('dbversion', '1');

        db.transaction((tx) => {
          let plantSql = 'CREATE TABLE IF NOT EXISTS plants\n';
          plantSql += '(id INTEGER PRIMARY KEY, name TEXT, latinname TEXT, updated TEXT)';
          tx.executeSql(plantSql, [],
                        () => console.log('Created plant table'),
                        (tx, error) => console.log(`Error: ${error.message}`));

          let observationSql = 'CREATE TABLE IF NOT EXISTS observations\n';
          observationSql += '(id INTEGER PRIMARY KEY, plantid INTEGER, inputtedName TEXT, ';
          observationSql += 'inputtedLatinName TEXT, date TEXT, maplocationid INTEGER, ';
          observationSql += 'description TEXT, imageid INTEGER)';
          tx.executeSql(observationSql, [],
                        () => console.log('Created observation table'),
                        (tx, error) => console.log(`Error: ${error.message}`));

          let mapLocationSql = 'CREATE TABLE IF NOT EXISTS maplocation\n';
          mapLocationSql += '(id INTEGER PRIMARY KEY, name TEXT, latitude REAL, longitude REAL)';
          tx.executeSql(mapLocationSql, [],
                        () => console.log('Created map location table'),
                        (tx, error) => console.log(`Error: ${error.message}`));

          let imageSql = 'CREATE TABLE IF NOT EXISTS imgdata\n';
          imageSql += '(id INTEGER PRIMARY KEY, fileuri TEXT, debugdatauri TEXT)';
          tx.executeSql(imageSql, [],
                        () => console.log('Created image table'),
                        (tx, error) => console.log(`Error: ${error.message}`));
        });
      }
    });
  }

  public migrate() {
    const dbVersion = parseInt(localStorage.getItem('dbversion'), 10);
    if (dbVersion < 2) {
      this.migrate1To2();
    }
  }

  private migrate1To2() {
    this.sqlite.create({
      name: DB_FILE_NAME,
      location: DB_LOCATION,
    }).then((db: SQLiteObject) => {
      const sql = 'ALTER TABLE maplocation RENAME TO maplocations';
      db.transaction((tx) => {
        tx.executeSql(sql, [],
                      () => {
                        console.log('Migrated from 1 to 2');
                        localStorage.setItem('dbversion', '2');
                      },
                      ((tx, error) => console.log(`Error: ${error.message}`)));
      });
    });
  }
}
