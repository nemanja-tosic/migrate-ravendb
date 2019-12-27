import { Given, When, Then, TableDefinition, After, Before } from 'cucumber';
import { should } from 'chai';

import SessionFactory from '../../src/port/adapter/persistence/SessionFactory';
import TestAdapter from '../../src/port/adapter/test/TestAdapter';
import ConfigProvider from '../../src/port/adapter/config/ConfigProvider';

should();

Before(() => {
  ConfigProvider.Instance = new ConfigProvider({
    databaseUrl: 'http://192.168.42.42',
    databaseName: 'test'
  });
});

Given(/^the following entities:$/, function(entities: TableDefinition) {
  return SessionFactory.Instance.createSession(async session => {
    for (const row of entities.raw()) {
      const entity = JSON.parse(row[0]);

      await session.store(entity);

      this.cleanup.push(entity.id);
    }
  });
});

Given(/^a pending migration "(.*?)":$/, function(
  description: string,
  script: string
) {
  return (async () => {
    this.migrations.push(await TestAdapter.create(script, description));
  })();
});

When(/^I migrate up$/, function() {
  return TestAdapter.up(this.migrations);
});

Then(/^the database should contain:$/, function(expectedEntities) {
  return SessionFactory.Instance.createSession(async session => {
    for (const expectedEntity of expectedEntities
      .raw()
      .map(e => JSON.parse(e))) {
      const actualEntity = await session.load(expectedEntity.id);

      for (const [key, val] of Object.entries(expectedEntity)) {
        actualEntity.should.have.property(key, val);
      }
    }
  });
});

After(function() {
  return SessionFactory.Instance.createSession(async session => {
    for (const entityId of this.cleanup) {
      await session.delete(entityId);
    }
  });
});
