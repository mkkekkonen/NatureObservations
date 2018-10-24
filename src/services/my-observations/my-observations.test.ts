import * as moment from 'moment';
import Plant from '../../models/plant/Plant';
import Observation from '../../models/observation/Observation';
import {
  NAME,
  LATINNAME,
  DATE,
  ASC,
  DESC,
  sortObservations,
} from './my-observations';

const dandelion = new Plant(0, 'Voikukka', 'Taraxacum officinale');
const daisy = new Plant(1, 'Päivänkakkara', 'Leucanthemum vulgare');

const obs1 = new Observation(0, dandelion, '', '', moment());
const obs2 = new Observation(1, daisy, '', '', moment('2018-10-23'));
const obs3 = new Observation(2, dandelion, '', '', moment('2018-10-22'));

const observations = [obs1, obs2, obs3];

describe('sorting', () => {
  it('sorts by name', () => {
    const arrayToSort = [...observations];
    sortObservations(arrayToSort, NAME);
    expect(arrayToSort).toEqual([obs2, obs1, obs3]);
  });

  it('sorts by Latin name', () => {
    const arrayToSort = [...observations];
    sortObservations(arrayToSort, LATINNAME);
    expect(arrayToSort).toEqual([obs2, obs1, obs3]);
  });

  it('sorts by date', () => {
    const arrayToSort = [...observations];
    sortObservations(arrayToSort, DATE);
    expect(arrayToSort).toEqual([obs3, obs2, obs1]);
  });

  it('sorts by name descending', () => {
    const arrayToSort = [...observations];
    sortObservations(arrayToSort, NAME, DESC);
    expect(arrayToSort).toEqual([obs3, obs1, obs2]);
  });

  it('sorts by Latin name', () => {
    const arrayToSort = [...observations];
    sortObservations(arrayToSort, LATINNAME, DESC);
    expect(arrayToSort).toEqual([obs3, obs1, obs2]);
  });

  it('sorts by date', () => {
    const arrayToSort = [...observations];
    sortObservations(arrayToSort, DATE, DESC);
    expect(arrayToSort).toEqual([obs1, obs2, obs3]);
  });
});
