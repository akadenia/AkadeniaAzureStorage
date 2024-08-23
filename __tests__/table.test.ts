import { jest, describe, expect, it, afterEach } from "@jest/globals"

import { TableStorage } from "../src/table"

afterEach(() => {
  jest.clearAllMocks()
})


const storageConnectionString = "UseDevelopmentStorage=true"

describe("TableStorage", () => {
  it("should create a table", async () => {
    const table = new TableStorage(storageConnectionString, "tableToBeDeleted")
    const result = await table.createTable()

    expect(result).toBe(true)
  })

  it("should delete a table", async () => {
    const table = new TableStorage(storageConnectionString, "tableToBeDeleted")
    const result = await table.deleteTable()

    expect(result).toBe(true)
  })

  it("should insert an entity", async () => {
    const table = new TableStorage(storageConnectionString, "TestTable")
    const entity = {
      partitionKey: "partitionKey",
      rowKey: "rowKey",
      name: "name",
      age: 30,
    }

    const result = await table.insertEntity(entity)

    expect(result).toBe(true)
  })

  it("should get a TableClient object", () => {
    const table = new TableStorage(storageConnectionString, "tableName")
    const tableClient = table.getTableClient()

    expect(tableClient).toBeDefined()
  })

  it("should throw an error if the table name is missing", () => {
    expect(() => {
      new TableStorage(storageConnectionString, "")
    }).toThrow("Missing table name")
  })
})
