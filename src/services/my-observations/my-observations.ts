import * as moment from 'moment';
import { get } from 'lodash';
import Observation from '../../models/observation/Observation';

export const NAME = 'name';
export const LATINNAME = 'latinName';
export const DATE = 'date';
export const ASC = 'ascending';
export const DESC = 'descending';

export const sortObservations = (
  observations: Observation[], sortBy: string, order: string = ASC,
) => {
  let propertyKey;
  switch (sortBy) {
    case NAME:
      propertyKey = 'plant.name';
      break;
    case LATINNAME:
      propertyKey = 'plant.latinName';
      break;
    case DATE:
    default:
      propertyKey = 'date';
  }

  observations.sort((a, b) => {
    const comparedPropertyA = get(a, propertyKey);
    const comparedPropertyB = get(b, propertyKey);

    if (!comparedPropertyA || !comparedPropertyB) {
      return 0;
    }

    if (sortBy === NAME || sortBy === LATINNAME) {
      const aString = comparedPropertyA as string;
      const bString = comparedPropertyB as string;
      return aString.localeCompare(bString);
    }

    if (sortBy === DATE) {
      const aDate = comparedPropertyA as moment.Moment;
      const bDate = comparedPropertyB as moment.Moment;
      if (aDate.isBefore(bDate)) {
        return -1;
      }
      if (aDate.isSame(bDate)) {
        return 0;
      }
      if (aDate.isAfter(bDate)) {
        return 1;
      }
    }

    return 0;
  });

  if (order === DESC) {
    observations.reverse();
  }
};
