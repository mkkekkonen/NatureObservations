import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import MapLocation from '../../models/map-location/MapLocation';
import { DB_FILE_NAME, DB_LOCATION } from './database';

@Injectable()
export class MapLocationDatabaseProvider {

  constructor(public http: HttpClient, private sqlite: SQLite) {
    console.log('Hello MapLocationDatabaseProvider Provider');
  }

  insertMapLocation(mapLocation: MapLocation): Promise<any> {
    if (mapLocation) {
      return this.sqlite.create({
        name: DB_FILE_NAME,
        location: DB_LOCATION,
      }).then((db: SQLiteObject) => {
        let insertMapLocationSql = 'INSERT INTO maplocation (name, latitude, longitude)\n';
        insertMapLocationSql += 'VALUES (?, ?, ?)';
        const valuesArray = [
          mapLocation.name || '',
          mapLocation.latitude || 0,
          mapLocation.longitude || 0,
        ];
        return db.transaction((tx) => {
          tx.executeSql(insertMapLocationSql, valuesArray,
                        () => console.log('Successfully inserted map location'),
                        (tx, error) => console.log(`Error inserting image: ${error.message}`));
          tx.executeSql('SELECT last_insert_rowid()', [],
                        (tx, res) => {
                          const id = res.rows.item(0)['last_insert_rowid()'];
                          console.log(`Id: ${id}`);
                          mapLocation.id = id;
                        },
                        (tx, error) => console.log(`Error fetching insert id: ${error.message}`));
        });

      });
    }
    return new Promise(resolve => resolve(null));
  }
}
