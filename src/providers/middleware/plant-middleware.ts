import * as moment from 'moment';
import { basePath } from './middleware';
import Plant from '../../models/plant/Plant';

const parsePlant = (jsonPlant): Plant => new Plant(
  jsonPlant.id,
  jsonPlant.name,
  jsonPlant.latinname,
  moment(jsonPlant.updated),
);

export const getPlants = (): Promise<Plant[]> => {
  return fetch(`${basePath}/getspecies.php`)
    .then(response => response.json())
    .then(json => json.map(listPlant => parsePlant(listPlant)));
};
