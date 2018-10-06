import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import * as moment from 'moment';
import Observation from '../../models/observation/Observation';
import { DB_FILE_NAME, DB_LOCATION } from './database';

@Injectable()
export class ObservationDatabaseProvider {

  constructor(public http: HttpClient, private sqlite: SQLite) {
    console.log('Hello ObservationDatabaseProvider Provider');
  }

  insertObservation(observation: Observation) {
    this.sqlite.create({
      name: DB_FILE_NAME,
      location: DB_LOCATION,
    }).then((db: SQLiteObject) => {
      let insertObservationSql = 'INSERT INTO observations\n';
      insertObservationSql += '(plantid, inputtedname, date, ';
      insertObservationSql += 'maplocationid, description, imageid)\n';
      insertObservationSql += 'VALUES (?, ?, ?, ?, ?, ?)';
      const valuesArray = [
        (observation.plant && observation.plant.id) || 0,
        observation.inputtedName || '',
        (observation.date && observation.date.format()) || moment().format(),
        (observation.mapLocation && observation.mapLocation.id) || 'NULL',
        observation.description,
        (observation.imageData && observation.imageData.id) || 'NULL',
      ];
      db.transaction((tx) => {
        tx.executeSql(insertObservationSql, valuesArray,
                      () => console.log('Successfully inserted observation'),
                      (tx, error) => console.log(`Error inserting image: ${error.message}`));
        tx.executeSql('SELECT last_insert_rowid()', [],
                      (tx, res) => {
                        const id = res.rows.item(0)['last_insert_rowid()'];
                        console.log(`Id: ${id}`);
                        observation.id = id;
                      }),
                      (tx, error) => console.log(`Error fetching insert id: ${error.message}`);
      });
    });
  }
}
