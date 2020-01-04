import * as moment from 'moment';

import observationTypes from '../../assets/json/observation-types';
import * as typeNames from '../../assets/json/observation-type-names';

import Plant from '../../models/plant/Plant';
import { formulatePlantSql } from './plant-database';
import { findObsType } from './observation-database';
import ObservationType from '../../models/observation-type/ObservationType';

describe('formulatePlantSql', () => {
  it('formulates correct SQL', () => {
    const date = moment();

    const plants = [
      new Plant(1, 'Voikukka', 'Taraxacum officinale', date),
      new Plant(2, 'Sinivuokko', 'Hepatica nobilis', date),
      new Plant(3, 'Päivänkakkara', 'Leucanthemum vulgare', date),
    ];

    let expectedSql = 'INSERT OR REPLACE INTO plants\n';
    expectedSql += '(id, name, latinname, updated) VALUES\n';
    expectedSql += '(?, ?, ?, ?),\n';
    expectedSql += '(?, ?, ?, ?),\n';
    expectedSql += '(?, ?, ?, ?)';

    const expectedArray = [
      1, 'Voikukka', 'Taraxacum officinale', date.format(),
      2, 'Sinivuokko', 'Hepatica nobilis', date.format(),
      3, 'Päivänkakkara', 'Leucanthemum vulgare', date.format(),
    ];

    const expected = {
      flattenedArray: expectedArray,
      insertReplaceSql: expectedSql,
    };

    expect(formulatePlantSql(plants)).toEqual(expected);
  });
});

describe('findObsType', () => {
  it('finds correct observation type', () => {
    const name = typeNames.LANDSCAPE;

    const typeData = observationTypes.find(data => data.name === name);
    const type = new ObservationType(name, typeData.icon);

    expect(findObsType(name)).toEqual(type);
  });
});
