import { Given, When, Then, TableDefinition, After } from 'cucumber';
import { should } from 'chai';

import TestAdapter from '../../src/port/adapter/test/TestAdapter';

should();

Given(/^the following entities:$/, function(entities: TableDefinition) {
  return (async () => {
    for (const row of entities.raw()) {
      const entity = JSON.parse(row[0]);

      await TestAdapter.createEntity(entity);

      this.cleanup.push(entity.id);
    }
  })();
});

Given(/^a pending migration "(.*?)":$/, function(
  description: string,
  script: string
) {
  return (async () => {
    this.migrations.push(await TestAdapter.create(script, description));
  })();
});

When(/^I migrate up$/, { timeout: 20 * 1000 }, function() {
  return TestAdapter.up(this.migrations);
});

Then(/^the database should contain:$/, function(expectedEntities) {
  return (async () => {
    for (const expectedEntity of expectedEntities
      .raw()
      .map((e: any) => JSON.parse(e))) {
      const actualEntity = await TestAdapter.loadEntity(expectedEntity.id);

      for (const [key, val] of Object.entries(expectedEntity)) {
        actualEntity.should.have.property(key, val);
      }
    }
  })();
});

After(function() {
  return TestAdapter.deleteEntities(this.cleanup);
});
