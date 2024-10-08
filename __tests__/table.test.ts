import { describe, expect, it, jest } from "@jest/globals"

import { TableStorage } from "../src/table"

const storageConnectionString = "UseDevelopmentStorage=true"

describe("TableStorage", () => {
  it("should create a table", async () => {
    const table = new TableStorage(storageConnectionString, "tableToBeDeleted")
    const result = await table.createTable()

    expect(result).toBe(true)
  })

  it("should delete a table", async () => {
    const table = new TableStorage(storageConnectionString, "tableToBeDeleted")
    await table.createTable()
    const result = await table.deleteTable()

    expect(result).toBe(true)
  })

  it("should insert an entity", async () => {
    const table = new TableStorage(storageConnectionString, "TestTableInsert")
    table.createTable()

    const entity = {
      partitionKey: `partitionKey`,
      rowKey: `rowKey_${Math.random()}`,
      name: "name",
      age: 30,
    }

    const result = await table.insert(entity)

    expect(result).toBe(true)

    await table.deleteTable()
  })

  it("should get a TableClient object", () => {
    const table = new TableStorage(storageConnectionString, "TestTableGet")
    const tableClient = table.getTableClient()

    expect(tableClient).toBeDefined()
  })

  it("should throw an error if the table name is missing", () => {
    expect(() => {
      new TableStorage(storageConnectionString, "")
    }).toThrow("Missing table name")
  })

  it("should list added entities", async () => {
    const table = new TableStorage(storageConnectionString, "TestTableList")
    await table.createTable()

    jest.setTimeout(1000)

    const entity1 = {
      partitionKey: "p1",
      rowKey: "1",
      name: "name1",
      age: 20,
    }

    const entity2 = {
      partitionKey: "p1",
      rowKey: "2",
      name: "name2",
      age: 30,
    }

    await table.insert(entity1)
    await table.insert(entity2)

    jest.setTimeout(500)

    const entities = await table.list()

    expect(entities).toBeDefined()
    expect(entities.length).toBeGreaterThan(0)
    expect(entities[0].partitionKey).toBe(entity1.partitionKey)

    jest.setTimeout(500)

    await table.deleteTable()
  })

  it("should delete an entity", async () => {
    const table = new TableStorage(storageConnectionString, "TestTableDelete")
    await table.createTable()

    const entity = {
      partitionKey: "p1",
      rowKey: "1",
      name: "name1",
      age: 20,
    }

    await table.insert(entity)
    const result = await table.delete(entity.partitionKey, entity.rowKey)

    expect(result).toBe(true)

    jest.setTimeout(1000)

    const entities = await table.list()

    expect(entities).toBeDefined()
    expect(entities.length).toBe(0)

    jest.setTimeout(500)

    await table.deleteTable()
  })
})

it("should update an entity", async () => {
  const table = new TableStorage(storageConnectionString, "TestTableUpdate")
  await table.createTable()

  const entity = {
    partitionKey: "p1",
    rowKey: "1",
    name: "name1",
    age: 20,
  }

  await table.insert(entity)

  entity.age = 30

  const result = await table.update(entity)

  expect(result).toBe(true)

  jest.setTimeout(1000)

  const entities = await table.list()

  expect(entities).toBeDefined()
  expect(entities.length).toBe(1)
  expect(entities[0].age).toBe(30)

  jest.setTimeout(500)

  await table.deleteTable()
})
