import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import MapLocation from '../../models/map-location/MapLocation';
import { DB_FILE_NAME, DB_LOCATION } from './database';

const createMapLocation = mapLocationData => new MapLocation(
  mapLocationData.id,
  mapLocationData.name,
  mapLocationData.latitude,
  mapLocationData.longitude,
);

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
        let insertMapLocationSql = 'INSERT INTO maplocations (name, latitude, longitude)\n';
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

  public getMapLocations(): Promise<MapLocation[]> {
    return this.sqlite.create({
      name: DB_FILE_NAME,
      location: DB_LOCATION,
    }).then((db: SQLiteObject) => {
      const sql = 'SELECT * FROM maplocations';
      return db.executeSql(sql, [])
        .then((data) => {
          const mapLocations = [];
          for (let i = 0; i < data.rows.length; i += 1) {
            const mapLocData = data.rows.item(i);
            const mapLocation = createMapLocation(mapLocData);
            mapLocations.push(mapLocation);
          }
          return mapLocations;
        });
    });
  }

  public getMapLocationById(id: number): Promise<MapLocation> {
    return this.sqlite.create({
      name: DB_FILE_NAME,
      location: DB_LOCATION,
    }).then((db: SQLiteObject) => {
      const sql = 'SELECT * FROM maplocations WHERE id = ?';
      return db.executeSql(sql, [id])
        .then((data) => {
          if (data.rows.length > 0) {
            const mapLocData = data.rows.item(0);
            return createMapLocation(mapLocData);
          }
          return null;
        });
    });
  }

  public updateMapLocation(mapLocation: MapLocation): Promise<void> {
    if (mapLocation && mapLocation.id) {
      return this.sqlite.create({
        name: DB_FILE_NAME,
        location: DB_LOCATION,
      }).then((db: SQLiteObject) => {
        let sql = 'UPDATE maplocations\n';
        sql += 'SET name = ?, latitude = ?, longitude = ?\n';
        sql += 'WHERE id = ?';
        const valuesArray = [
          mapLocation.name,
          mapLocation.latitude,
          mapLocation.longitude,
          mapLocation.id,
        ];
        return db.executeSql(sql, valuesArray);
      });
    }
    return new Promise(resolve => resolve(null));
  }

  public deleteMapLocations() {
    return this.sqlite.create({
      name: DB_FILE_NAME,
      location: DB_LOCATION,
    }).then((db: SQLiteObject) => {
      const sql = 'DELETE FROM maplocations';
      return db.executeSql(sql, []);
    });
  }

  public deleteMapLocation(id: number): Promise<void> {
    if (id) {
      return this.sqlite.create({
        name: DB_FILE_NAME,
        location: DB_LOCATION,
      }).then((db: SQLiteObject) => {
        const sql = 'DELETE FROM maplocations WHERE id = ?';
        return db.executeSql(sql, [id]);
      });
    }
    return new Promise(resolve => resolve(null));
  }
}
