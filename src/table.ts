import { GetTableEntityResponse, ListTableEntitiesOptions, TableClient, TableEntity, TableEntityResult } from "@azure/data-tables"
import { DefaultAzureCredential } from "@azure/identity"

/**
 * @interface ITableEntity - An interface that represents an entity in an azure table
    The following characters are not allowed in values for the PartitionKey and RowKey properties:
    The forward slash (/) character
    The backslash (\) character
    The number sign (#) character
    The question mark (?) character
    Control characters from U+0000 to U+001F, including:
    The horizontal tab (\t) character
    The linefeed (\n) character
    The carriage return (\r) character
    Control characters from U+007F to U+009F

    The partition key and row key may be a string value up to 1024 characters in size.
 */
export interface ITableEntity extends TableEntity {
  readonly timestamp?: Date
  [key: string]: any
}

export interface TableManagedIdentityOptions {
  accountName: string
  tableName: string
  managedIdentityClientId?: string
}

/**
 * @class TableStorage - A class that contains azure table storage helpers
 */
export class TableStorage {
  private tableClient: TableClient

  constructor(connectionString: string, tableName: string)
  constructor(managedIdentityOptions: TableManagedIdentityOptions)
  constructor(connectionStringOrOptions: string | TableManagedIdentityOptions, tableName?: string) {
    if (typeof connectionStringOrOptions === "string") {
      if (!connectionStringOrOptions) {
        throw new Error("Missing connection string")
      }

      if (!tableName) {
        throw new Error("Missing table name")
      }

      this.tableClient = TableClient.fromConnectionString(connectionStringOrOptions, tableName)
    } else {
      if (!connectionStringOrOptions.accountName) {
        throw new Error("Account name is required when using managed identity")
      }

      if (!connectionStringOrOptions.tableName) {
        throw new Error("Table name is required")
      }

      const accountUrl = `https://${connectionStringOrOptions.accountName}.table.core.windows.net`
      const credential = new DefaultAzureCredential({
        managedIdentityClientId: connectionStringOrOptions.managedIdentityClientId,
      })
      this.tableClient = new TableClient(accountUrl, connectionStringOrOptions.tableName, credential)
    }
  }

  /**
   * @returns {TableClient} - A TableClient object
   */
  getTableClient(): TableClient {
    return this.tableClient
  }

  /** Creates a table in the storage account
   * @returns {Promise<void>} - A promise that resolves when the table is created
   * @returns {Promise<boolean>} - A promise that resolves to true if the table was created
   **/
  async createTable(): Promise<boolean> {
    try {
      await this.tableClient.createTable()
    } catch (error) {
      return false
    }

    return true
  }

  /** Deletes a table in the storage account
   * @returns {Promise<void>} - A promise that resolves when the table is deleted
   * @returns {Promise<boolean>} - A promise that resolves to true if the table was deleted
   **/
  async deleteTable(): Promise<boolean> {
    try {
      await this.tableClient.deleteTable()
    } catch (error) {
      return false
    }

    return true
  }

  /**
   * @param {ITableEntity} entity - The entity to insert
   * @returns {Promise<boolean>} - A promise that resolves to true if the entity was inserted
   */
  async insert(entity: ITableEntity): Promise<boolean> {
    try {
      await this.tableClient.createEntity(entity)
    } catch (error) {
      return false
    }

    return true
  }

  /**
   * @param {ITableEntity} entity - The entity to update
   * @returns {Promise<boolean>} - A promise that resolves to true if the entity was updated
   */
  async update(entity: ITableEntity): Promise<boolean> {
    try {
      await this.tableClient.updateEntity(entity)
    } catch (error) {
      return false
    }

    return true
  }

  /**
   * @param {ITableEntity} entity - The entity to upsert
   * @returns {Promise<boolean>} - A promise that resolves to true if the entity was upserted
   */
  async upsert(entity: ITableEntity): Promise<boolean> {
    try {
      await this.tableClient.upsertEntity(entity)
    } catch (error) {
      return false
    }

    return true
  }

  /**
   * @param {string} partitionKey - The partition key
   * @param {string} rowKey - The row key
   * @returns {Promise<ITableEntity>} - The deleted entity
   */
  async delete(partitionKey: string, rowKey: string): Promise<boolean> {
    try {
      await this.tableClient.deleteEntity(partitionKey, rowKey)
    } catch (error) {
      return false
    }

    return true
  }

  /**
   * @param {string} partitionKey - The partition key
   * @param {string} rowKey - The row key
   * @returns {Promise<ITableEntity>} - The retrieved entity
   */
  async get(partitionKey: string, rowKey: string): Promise<GetTableEntityResponse<TableEntityResult<ITableEntity>>> {
    return this.tableClient.getEntity(partitionKey, rowKey)
  }

  async list<T extends ITableEntity>(options?: ListTableEntitiesOptions): Promise<T[]> {
    const iterator = this.tableClient.listEntities<T>(options)
    const entities: T[] = []

    for await (const entity of iterator) {
      entities.push(entity)
    }

    return entities
  }
}
