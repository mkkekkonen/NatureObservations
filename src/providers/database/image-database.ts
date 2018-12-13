import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import ImgData from '../../models/image-data/ImgData';
import { DB_FILE_NAME, DB_LOCATION } from './database';

const createImage = imageData => new ImgData(
  imageData.id,
  imageData.fileuri,
  imageData.debugdatauri,
  imageData.observationid,
);

@Injectable()
export class ImageDatabaseProvider {

  constructor(public http: HttpClient, private sqlite: SQLite) {
    console.log('Hello ImageDatabaseProvider Provider');
  }

  public insertImage(imageData: ImgData): Promise<void> {
    if (imageData) {
      return this.sqlite.create({
        name: DB_FILE_NAME,
        location: DB_LOCATION,
      }).then((db: SQLiteObject) => {
        let insertImageSql = 'INSERT INTO imgdata (fileuri, debugdatauri, observationid)\n';
        insertImageSql += 'VALUES (?, ?, ?)';
        const valueArray = [
          imageData.fileUri || '',
          imageData.debugDataUri || '',
          imageData.observationId || 0,
        ];
        return db.transaction((tx) => {
          tx.executeSql(insertImageSql, valueArray,
                        () => console.log('Successfully inserted image'),
                        (tx, error) => console.log(`Error inserting image: ${error.message}`));
          tx.executeSql('SELECT last_insert_rowid()', [],
                        (tx, res) => {
                          const id = res.rows.item(0)['last_insert_rowid()'];
                          console.log(`Id: ${id}`);
                          imageData.id = id;
                        },
                        (tx, error) => console.log(`Error fetching insert id: ${error.message}`));
        });
      });
    }
    return new Promise(resolve => resolve(null));
  }

  public getImages(): Promise<ImgData[]> {
    return this.sqlite.create({
      name: DB_FILE_NAME,
      location: DB_LOCATION,
    }).then((db: SQLiteObject) => {
      const sql = 'SELECT * FROM imgdata';
      return db.executeSql(sql, [])
        .then((data) => {
          const images = [];
          for (let i = 0; i < data.rows.length; i += 1) {
            const dbImgData = data.rows.item(i);
            const imgData = createImage(dbImgData);
            images.push(imgData);
          }
          return images;
        });
    });
  }

  public deleteAllImages() {
    this.sqlite.create({
      name: DB_FILE_NAME,
      location: DB_LOCATION,
    }).then((db: SQLiteObject) => {
      const dropImagesSql = 'DELETE FROM imgdata';
      db.executeSql(dropImagesSql, [])
        .then(data => console.log('Successfully deleted images'))
        .catch(err => console.log(`Error deleting images: ${err.message}`));
    });
  }

  public getImageById(id: number): Promise<ImgData> {
    return this.sqlite.create({
      name: DB_FILE_NAME,
      location: DB_LOCATION,
    }).then((db: SQLiteObject) => {
      const sql = 'SELECT * FROM imgdata WHERE id = ?';
      return db.executeSql(sql, [id])
        .then((data) => {
          if (data.rows.length > 0) {
            const imgDataFromDb = data.rows.item(0);
            return createImage(imgDataFromDb);
          }
          return null;
        });
    });
  }

  public getImageByObsId(obsId: number): Promise<ImgData> {
    return this.sqlite.create({
      name: DB_FILE_NAME,
      location: DB_LOCATION,
    }).then((db: SQLiteObject) => {
      const sql = 'SELECT * FROM imgdata WHERE observationid = ?';
      return db.executeSql(sql, [obsId])
        .then((data) => {
          if (data.rows.length > 0) {
            const imgDataFromDb = data.rows.item(0);
            return createImage(imgDataFromDb);
          }
          return null;
        });
    });
  }

  public updateImage(imageData: ImgData): Promise<void> {
    if (imageData && imageData.id) {
      return this.sqlite.create({
        name: DB_FILE_NAME,
        location: DB_LOCATION,
      }).then((db: SQLiteObject) => {
        let sql = 'UPDATE imgdata\n';
        sql += 'SET fileuri = ?, debugdatauri = ?,\n';
        sql += 'observationid = ?\n',
        sql += 'WHERE id = ?';
        const valuesArray = [
          imageData.fileUri || '',
          imageData.debugDataUri || '',
          imageData.observationId || 0,
          imageData.id,
        ];
        return db.executeSql(sql, valuesArray);
      });
    }
    return new Promise(resolve => resolve(null));
  }

  public deleteImage(id: number): Promise<void> {
    if (id) {
      return this.sqlite.create({
        name: DB_FILE_NAME,
        location: DB_LOCATION,
      }).then((db: SQLiteObject) => {
        const sql = 'DELETE FROM imgdata WHERE id = ?';
        return db.executeSql(sql, [id]);
      });
    }
    return new Promise(resolve => resolve(null));
  }
}
