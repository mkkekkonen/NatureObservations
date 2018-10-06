import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import ImgData from '../../models/image-data/ImgData';
import { DB_FILE_NAME, DB_LOCATION } from './database';

@Injectable()
export class ImageDatabaseProvider {

  constructor(public http: HttpClient, private sqlite: SQLite) {
    console.log('Hello ImageDatabaseProvider Provider');
  }

  insertImage(imageData: ImgData): Promise<any> {
    if (imageData) {
      return this.sqlite.create({
        name: DB_FILE_NAME,
        location: DB_LOCATION,
      }).then((db: SQLiteObject) => {
        const insertImageSql = 'INSERT INTO imgdata (fileuri, debugdatauri) VALUES (?, ?)';
        const valueArray = [imageData.fileUri || '', imageData.debugDataUri || ''];
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

  deleteAllImages() {
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
}
