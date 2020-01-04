import * as moment from 'moment';
import ObservationType from '../observation-type/ObservationType';
import MapLocation from '../map-location/MapLocation';
import ImgData from '../image-data/ImgData';

export default class Observation {
  constructor(public id: number = 0, public type: ObservationType = null,
              public title: string = '', public description: string = '',
              public date: moment.Moment = null, public mapLocation: MapLocation = null,
              public imageData: ImgData = null) {
  }
}
