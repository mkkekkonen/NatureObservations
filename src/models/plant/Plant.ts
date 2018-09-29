import * as moment from 'moment';

export default class Plant {
  constructor(public id: number = 0, public name: string = '',
              public latinName: string = '', public updated: moment.Moment = null) {
  }
}
