import * as moment from 'moment';
import Plant from '../plant/Plant';
import MapLocation from '../map-location/MapLocation';
import ImgData from '../image-data/ImgData';

export default class Observation {
  constructor(public id: number = 0, public plant: Plant = null,
              public inputtedName: string = '', public inputtedLatinName: string = '',
              public date: moment.Moment = null, public mapLocation: MapLocation = null,
              public description: string = '', public imageData: ImgData = null) {
  }
}
