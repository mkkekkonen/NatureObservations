import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import * as moment from 'moment';
import Observation from '../../models/observation/Observation';
import { DB_FILE_NAME, DB_LOCATION } from './database';
import { PlantDatabaseProvider } from './plant-database';
import { MapLocationDatabaseProvider } from './map-location-database';
import { ImageDatabaseProvider } from './image-database';

@Injectable()
export class ObservationDatabaseProvider {

  constructor(public http: HttpClient, private sqlite: SQLite,
              private plantDb: PlantDatabaseProvider,
              private mapLocDb: MapLocationDatabaseProvider,
              private imageDb: ImageDatabaseProvider) {
    console.log('Hello ObservationDatabaseProvider Provider');
  }

  public insertObservation(observation: Observation) {
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
                  const observation = new Observation(
                    obsData.id,
                    plants.find(plant => plant.id === obsData.plantid),
                    obsData.inputtedname,
                    '',
                    moment(obsData.date),
                    mapLocations.find(mapLocation => mapLocation.id === obsData.maplocationid),
                    obsData.description,
                    images.find(image => image.id === obsData.imageid),
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
}
