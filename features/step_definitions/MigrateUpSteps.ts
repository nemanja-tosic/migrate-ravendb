import { Given, When, Then, DataTable, After } from '@cucumber/cucumber';
import { expect } from 'chai';
import { World } from '../support/World';

import TestAdapter from '../../src/port/adapter/test/TestAdapter';

Given<World>('the following entities:', async function (entities: DataTable) {
  for (const row of entities.raw()) {
    const entity = JSON.parse(row[0]);

    await TestAdapter.createEntity(entity);

    this.cleanup.push(entity.id);
  }
});

Given<World>(
  'a pending migration {string}:',
  async function (description: string, script: string) {
    this.migrations.push(await TestAdapter.create(script, description));
  }
);

When<World>('I migrate up', { timeout: 20 * 1000 }, async function () {
  return TestAdapter.up(this.migrations);
});

Then<World>(
  'the database should contain:',
  async function (expectedEntities: DataTable) {
    for (const row of expectedEntities.raw()) {
      const expectedEntity = JSON.parse(row[0]);
      const actualEntity = await TestAdapter.loadEntity(expectedEntity.id);

      expect(actualEntity).to.include(expectedEntity);
      // for (const [key, val] of Object.entries(expectedEntity)) {
      //   expect(actualEntity).to.have.property(key, val);
      // }
    }
  }
);

After<World>(async function () {
  return TestAdapter.deleteEntities(this.cleanup);
});
