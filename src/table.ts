import { TableClient } from "@azure/data-tables"

/**
 * @class TableStorage - A class that contains azure table storage helpers
 */
export class TableStorage {
  private tableClient: TableClient

  constructor(connectionString: string, tableName: string) {
    if (!connectionString) {
      throw new Error("Missing connection string")
    }

    if (!tableName) {
      throw new Error("Missing table name")
    }

    this.tableClient = new TableClient(connectionString, tableName)
  }

  /**
   * @returns {TableClient} - A TableClient object
   */
  getQueueClient(): TableClient {
    return this.tableClient
  }
}
