Feature: Migrate Up
  As a developer
  I want to provide a migration script that changes the database schema
  So that I can version control the database

  Scenario: Add a new field
    Given the following entities:
      | { "id": "Users/1", "firstName": "Bob", "lastName": "Martin" } |
    And a pending migration "add full name":
      """
      const collection = await session.advanced.loadStartingWith('Users/');

      for (const entity of collection) {
        entity.fullName = entity.firstName + ' ' + entity.lastName;
        await session.store(entity);
      }
      ===
      """
    When I migrate up
    Then the database should contain:
      | { "id": "Users/1", "firstName": "Bob", "lastName": "Martin", "fullName": "Bob Martin" } |
