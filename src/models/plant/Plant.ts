import * as moment from 'moment';

export default class Plant {

  constructor(public id: number, public name: string,
              public latinName: string, public updated: moment.Moment) {
  }
}
