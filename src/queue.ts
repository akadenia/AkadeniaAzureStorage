import { QueueClient } from "@azure/storage-queue"
import { DefaultAzureCredential } from "@azure/identity"

export interface QueueManagedIdentityOptions {
  accountName: string
  queueName: string
  managedIdentityClientId?: string
}

/**
 * @class QueueStorage - A class that contains azure queue storage helpers
 */
export class QueueStorage {
  private queueClient: QueueClient

  constructor(connectionString: string, queueName: string)
  constructor(managedIdentityOptions: QueueManagedIdentityOptions)
  constructor(connectionStringOrOptions: string | QueueManagedIdentityOptions, queueName?: string) {
    if (typeof connectionStringOrOptions === "string") {
      if (!connectionStringOrOptions) {
        throw new Error("Missing connection string")
      }
      if (!queueName) {
        throw new Error("Missing queue name")
      }
      this.queueClient = new QueueClient(connectionStringOrOptions, queueName)
    } else {
      if (!connectionStringOrOptions.accountName) {
        throw new Error("Account name is required when using managed identity")
      }
      if (!connectionStringOrOptions.queueName) {
        throw new Error("Queue name is required")
      }
      const accountUrl = `https://${connectionStringOrOptions.accountName}.queue.core.windows.net/${connectionStringOrOptions.queueName}`
      const credential = new DefaultAzureCredential({
        managedIdentityClientId: connectionStringOrOptions.managedIdentityClientId,
      })
      this.queueClient = new QueueClient(accountUrl, credential)
    }
  }

  /**
   * @returns {QueueClient} - A QueueClient object
   */
  getQueueClient(): QueueClient {
    return this.queueClient
  }

  /**
   * @param {string} message - The message to send
   * @returns {Promise<any>} - The response from the queue
   */
  async sendMessage(message: string): Promise<any> {
    return this.queueClient.sendMessage(message)
  }

  async receiveMessages(): Promise<any> {
    return this.queueClient.receiveMessages()
  }

  async deleteMessage(messageId: string, popReceipt: string): Promise<void> {
    await this.queueClient.deleteMessage(messageId, popReceipt)
  }
}
