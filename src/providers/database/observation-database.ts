import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import * as moment from 'moment';

import Observation from '../../models/observation/Observation';
import ObservationType from '../../models/observation-type/ObservationType';
import observationTypes from '../../assets/json/observation-types';

import { DB_FILE_NAME, DB_LOCATION } from './database';
import { PlantDatabaseProvider } from './plant-database';
import { MapLocationDatabaseProvider } from './map-location-database';
import { ImageDatabaseProvider } from './image-database';

export const findObsType = (name) => {
  const type = observationTypes.find(obsType => obsType.name === name);
  if (!type) {
    throw new Error('Invalid type!');
  }
  return new ObservationType(type.name, type.icon);
};

@Injectable()
export class ObservationDatabaseProvider {

  constructor(public http: HttpClient, private sqlite: SQLite,
              private plantDb: PlantDatabaseProvider,
              private mapLocDb: MapLocationDatabaseProvider,
              private imageDb: ImageDatabaseProvider) {
    console.log('Hello ObservationDatabaseProvider Provider');
  }

  public insertObservation(observation: Observation): Promise<void> {
    if (!observation.type) {
      throw new Error('Type is required!');
    }

    return this.sqlite.create({
      name: DB_FILE_NAME,
      location: DB_LOCATION,
    }).then((db: SQLiteObject) => {
      let insertObservationSql = 'INSERT INTO observations\n';
      insertObservationSql += '(type, date, description) ';
      insertObservationSql += 'VALUES (?, ?, ?)';
      const valuesArray = [
        (observation.type && observation.type.name),
        (observation.date && observation.date.format()) || moment().format(),
        observation.description,
      ];
      return db.transaction((tx) => {
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

  public getObservations(): Promise<Observation[]> {
    return this.sqlite.create({
      name: DB_FILE_NAME,
      location: DB_LOCATION,
    }).then((db: SQLiteObject) => {
      const sql = 'SELECT * FROM observations';
      return db.executeSql(sql, [])
        .then((data) => {
          return this.plantDb.getPlants().then((plants) => {
            return this.mapLocDb.getMapLocations().then((mapLocations) => {
              return this.imageDb.getImages().then((images) => {
                const observations = [];
                for (let i = 0; i < data.rows.length; i += 1) {
                  const obsData = data.rows.item(i);
                  const type = findObsType(obsData.type);
                  const observation = new Observation(
                    obsData.id,
                    type,
                    obsData.description,
                    moment(obsData.date),
                    mapLocations.find(mapLocation => obsData.id === mapLocation.observationId),
                    images.find(imgData => obsData.id === imgData.observationId),
                  );
                  observations.push(observation);
                }
                return observations;
              });
            });
          });
        });
    });
  }

  public getObservationById(id: number): Promise<Observation> {
    return this.sqlite.create({
      name: DB_FILE_NAME,
      location: DB_LOCATION,
    }).then((db: SQLiteObject) => {
      const sql = 'SELECT * FROM observations WHERE id = ?';
      return db.executeSql(sql, [id])
        .then((data) => {
          if (data.rows.length > 0) {
            const obsData = data.rows.item(0);
            return this.mapLocDb.getMapLocationByObsId(obsData.id || 0)
              .then((mapLocation) => {
                return this.imageDb.getImageByObsId(obsData.id || 0)
                  .then((image) => {
                    const type = findObsType(obsData.type);
                    return new Observation(
                      obsData.id,
                      type,
                      obsData.description,
                      moment(obsData.date),
                      mapLocation,
                      image,
                    );
                  });
              });
          }
          return null;
        });
    });
  }

  public updateObservation(observation: Observation): Promise<void> {
    if (observation && observation.id) {
      return this.sqlite.create({
        name: DB_FILE_NAME,
        location: DB_LOCATION,
      }).then((db: SQLiteObject) => {
        let sql = 'UPDATE observations\n';
        sql += 'SET date = ?, maplocationid = ?,\n';
        sql += 'description = ?, imageid = ?\n';
        sql += 'WHERE id = ?';
        const valuesArray = [
          moment().format(),
          (observation.mapLocation && observation.mapLocation.id) || 0,
          observation.description,
          (observation.imageData && observation.imageData.id) || 0,
          observation.id,
        ];
        return db.executeSql(sql, valuesArray);
      });
    }
    return new Promise(resolve => resolve(null));
  }

  public deleteObservations() {
    return this.sqlite.create({
      name: DB_FILE_NAME,
      location: DB_LOCATION,
    }).then((db: SQLiteObject) => {
      const sql = 'DELETE FROM observations';
      return db.executeSql(sql, []);
    });
  }

  public deleteObservation(id: number): Promise<void> {
    if (id) {
      return this.sqlite.create({
        name: DB_FILE_NAME,
        location: DB_LOCATION,
      }).then((db: SQLiteObject) => {
        const sql = 'DELETE FROM observations WHERE id = ?';
        return db.executeSql(sql, [id]);
      });
    }
    return new Promise(resolve => resolve(null));
  }
}
