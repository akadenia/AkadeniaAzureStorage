import { describe, expect, it, jest } from "@jest/globals"
import { BlobStorage, TableStorage } from "../src"
import { AZURITE_BLOB_CONNECTION_STRING } from "./test-utils"

// Mock @azure/identity
jest.mock("@azure/identity", () => {
  return {
    DefaultAzureCredential: jest.fn().mockImplementation(() => {
      return {
        // @ts-expect-error - Mock implementation doesn't need strict typing
        getToken: jest.fn().mockResolvedValue({
          token: "mock-token",
          expiresOnTimestamp: Date.now() + 3600000,
        }),
      }
    }),
  }
})

describe("Managed Identity Support", () => {
  describe("BlobStorage", () => {
    it("should create BlobStorage instance with system-assigned managed identity", () => {
      const blobStorage = new BlobStorage({
        accountName: "teststorageaccount",
      })

      expect(blobStorage).toBeDefined()
      const blobServiceClient = blobStorage.getBlobServiceUrl()
      expect(blobServiceClient).toBeDefined()
    })

    it("should create BlobStorage instance with user-assigned managed identity", () => {
      const blobStorage = new BlobStorage({
        accountName: "teststorageaccount",
        managedIdentityClientId: "client-id-123",
      })

      expect(blobStorage).toBeDefined()
      const blobServiceClient = blobStorage.getBlobServiceUrl()
      expect(blobServiceClient).toBeDefined()
    })

    it("should throw error when account name is missing", () => {
      expect(() => {
        new BlobStorage({ accountName: "" } as any)
      }).toThrow("Account name is required when using managed identity")
    })

    it("should return false for isEmulatorConnection with managed identity", () => {
      const blobStorage = new BlobStorage({
        accountName: "teststorageaccount",
      })

      expect(blobStorage.isEmulatorConnection()).toBe(false)
    })

    it("should return false for isSASUrl with managed identity", () => {
      const blobStorage = new BlobStorage({
        accountName: "teststorageaccount",
      })

      expect(blobStorage.isSASUrl()).toBe(false)
    })

    it("should throw error when generating SAS URL with managed identity", () => {
      const blobStorage = new BlobStorage({
        accountName: "teststorageaccount",
      })

      expect(() => {
        blobStorage.generateSASUrl("container", "blob")
      }).toThrow("SAS URL generation is not supported with managed identity")
    })

    it("should maintain backward compatibility with connection string", () => {
      const connectionString = process.env.TEST_AZURITE_CONNECTION_STRING || AZURITE_BLOB_CONNECTION_STRING

      const blobStorage = new BlobStorage(connectionString)
      expect(blobStorage).toBeDefined()
      expect(blobStorage.isEmulatorConnection()).toBe(true)
    })
  })

  describe("TableStorage", () => {
    it("should create TableStorage instance with system-assigned managed identity", () => {
      const tableStorage = new TableStorage({
        accountName: "teststorageaccount",
        tableName: "TestTable",
      })

      expect(tableStorage).toBeDefined()
      const tableClient = tableStorage.getTableClient()
      expect(tableClient).toBeDefined()
    })

    it("should create TableStorage instance with user-assigned managed identity", () => {
      const tableStorage = new TableStorage({
        accountName: "teststorageaccount",
        tableName: "TestTable",
        managedIdentityClientId: "client-id-123",
      })

      expect(tableStorage).toBeDefined()
      const tableClient = tableStorage.getTableClient()
      expect(tableClient).toBeDefined()
    })

    it("should throw error when account name is missing", () => {
      expect(() => {
        new TableStorage({ accountName: "", tableName: "TestTable" } as any)
      }).toThrow("Account name is required when using managed identity")
    })

    it("should throw error when table name is missing with managed identity", () => {
      expect(() => {
        new TableStorage({ accountName: "teststorageaccount", tableName: "" } as any)
      }).toThrow("Table name is required")
    })

    it("should maintain backward compatibility with connection string", () => {
      const connectionString = "UseDevelopmentStorage=true"
      const tableStorage = new TableStorage(connectionString, "TestTable")

      expect(tableStorage).toBeDefined()
      const tableClient = tableStorage.getTableClient()
      expect(tableClient).toBeDefined()
    })
  })

  // QueueStorage tests removed - Queue Storage does not support managed identity
  // See __tests__/queue.test.ts for Queue Storage tests using connection strings

  describe("Constructor Overloads", () => {
    it("should correctly identify connection string vs managed identity for BlobStorage", () => {
      const connectionString = "DefaultEndpointsProtocol=https;AccountName=test;AccountKey=key;"
      const blobStorage1 = new BlobStorage(connectionString)
      expect(blobStorage1.isEmulatorConnection()).toBe(false)

      const blobStorage2 = new BlobStorage({ accountName: "test" })
      expect(blobStorage2.isEmulatorConnection()).toBe(false)
      expect(blobStorage2.isSASUrl()).toBe(false)
    })

    it("should correctly identify connection string vs managed identity for TableStorage", () => {
      const connectionString = "UseDevelopmentStorage=true"
      const tableStorage1 = new TableStorage(connectionString, "Table1")
      expect(tableStorage1).toBeDefined()

      const tableStorage2 = new TableStorage({ accountName: "test", tableName: "Table1" })
      expect(tableStorage2).toBeDefined()
    })

    // QueueStorage test removed - Queue Storage does not support managed identity
  })
})
