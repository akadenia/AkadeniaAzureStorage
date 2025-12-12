import { QueueClient, QueueServiceClient, QueueSendMessageResponse } from "@azure/storage-queue"
import { DefaultAzureCredential } from "@azure/identity"

export interface QueueManagedIdentityOptions {
  accountName: string
  managedIdentityClientId?: string
}

/**
 * @class QueueStorage - A class that contains azure queue storage helpers
 * Supports both connection string and managed identity authentication
 */
export class QueueStorage {
  private queueServiceClient: QueueServiceClient

  constructor(connectionString: string)
  constructor(managedIdentityOptions: QueueManagedIdentityOptions)
  constructor(connectionStringOrOptions: string | QueueManagedIdentityOptions) {
    if (typeof connectionStringOrOptions === "string") {
      if (!connectionStringOrOptions) {
        throw new Error("Connection string is required for Queue Storage operations")
      }
      this.queueServiceClient = QueueServiceClient.fromConnectionString(connectionStringOrOptions)
    } else {
      if (!connectionStringOrOptions.accountName) {
        throw new Error("Account name is required when using managed identity")
      }

      const accountUrl = `https://${connectionStringOrOptions.accountName}.queue.core.windows.net`
      const credential = new DefaultAzureCredential({
        managedIdentityClientId: connectionStringOrOptions.managedIdentityClientId,
      })
      this.queueServiceClient = new QueueServiceClient(accountUrl, credential)
    }
  }

  /**
   * Gets a QueueClient for a specific queue
   * @param {string} queueName - The name of the queue
   * @returns {QueueClient} - A QueueClient instance for the specified queue
   */
  getQueueClient(queueName: string): QueueClient {
    if (!queueName) {
      throw new Error("Queue name is required")
    }
    return this.queueServiceClient.getQueueClient(queueName)
  }

  /**
   * Sends a message to the specified queue
   * @param {string} queueName - The name of the queue
   * @param {string | object} message - The message to send (string or object that will be JSON stringified)
   * @param {boolean} base64Encode - Whether to base64 encode the message (default: true)
   * @returns {Promise<QueueSendMessageResponse>} - The response from the queue operation
   * @throws {Error} If queue name or message is missing
   */
  async sendMessage(queueName: string, message: string | object, base64Encode = true): Promise<QueueSendMessageResponse> {
    if (!queueName) {
      throw new Error("Queue name is required")
    }
    if (!message) {
      throw new Error("Message is required")
    }

    const queueClient = this.getQueueClient(queueName)
    const messageString = typeof message === "string" ? message : JSON.stringify(message)
    const messageToSend = base64Encode ? Buffer.from(messageString).toString("base64") : messageString

    return await queueClient.sendMessage(messageToSend)
  }

  /**
   * Receives messages from the specified queue
   * @param {string} queueName - The name of the queue
   * @param {number} maxMessages - Maximum number of messages to receive (1-32, default: 1)
   * @param {number} visibilityTimeout - Visibility timeout in seconds (default: 30)
   * @returns {Promise<any>} - The received messages
   * @throws {Error} If queue name is missing
   */
  async receiveMessages(queueName: string, maxMessages = 1, visibilityTimeout = 30): Promise<any> {
    if (!queueName) {
      throw new Error("Queue name is required")
    }

    const queueClient = this.getQueueClient(queueName)
    return await queueClient.receiveMessages({ numberOfMessages: maxMessages, visibilityTimeout })
  }

  /**
   * Deletes a message from the specified queue
   * @param {string} queueName - The name of the queue
   * @param {string} messageId - The message ID
   * @param {string} popReceipt - The pop receipt from when the message was received
   * @returns {Promise<void>}
   * @throws {Error} If queue name, message ID, or pop receipt is missing
   */
  async deleteMessage(queueName: string, messageId: string, popReceipt: string): Promise<void> {
    if (!queueName) {
      throw new Error("Queue name is required")
    }
    if (!messageId) {
      throw new Error("Message ID is required")
    }
    if (!popReceipt) {
      throw new Error("Pop receipt is required")
    }

    const queueClient = this.getQueueClient(queueName)
    await queueClient.deleteMessage(messageId, popReceipt)
  }

  /**
   * Peeks messages from the specified queue without removing them
   * @param {string} queueName - The name of the queue
   * @param {number} maxMessages - Maximum number of messages to peek (1-32, default: 1)
   * @returns {Promise<any>} - The peeked messages
   * @throws {Error} If queue name is missing
   */
  async peekMessages(queueName: string, maxMessages = 1): Promise<any> {
    if (!queueName) {
      throw new Error("Queue name is required")
    }

    const queueClient = this.getQueueClient(queueName)
    return await queueClient.peekMessages({ numberOfMessages: maxMessages })
  }

  /**
   * Clears all messages from the specified queue
   * @param {string} queueName - The name of the queue
   * @returns {Promise<void>}
   * @throws {Error} If queue name is missing
   */
  async clearMessages(queueName: string): Promise<void> {
    if (!queueName) {
      throw new Error("Queue name is required")
    }

    const queueClient = this.getQueueClient(queueName)
    await queueClient.clearMessages()
  }

  /**
   * Creates a queue if it doesn't exist
   * @param {string} queueName - The name of the queue to create
   * @returns {Promise<void>}
   * @throws {Error} If queue name is missing
   */
  async createQueue(queueName: string): Promise<void> {
    if (!queueName) {
      throw new Error("Queue name is required")
    }

    const queueClient = this.getQueueClient(queueName)
    await queueClient.createIfNotExists()
  }

  /**
   * Deletes a queue
   * @param {string} queueName - The name of the queue to delete
   * @returns {Promise<void>}
   * @throws {Error} If queue name is missing
   */
  async deleteQueue(queueName: string): Promise<void> {
    if (!queueName) {
      throw new Error("Queue name is required")
    }

    const queueClient = this.getQueueClient(queueName)
    await queueClient.delete()
  }

  /**
   * Checks if a queue exists
   * @param {string} queueName - The name of the queue
   * @returns {Promise<boolean>} - True if the queue exists, false otherwise
   * @throws {Error} If queue name is missing
   */
  async queueExists(queueName: string): Promise<boolean> {
    if (!queueName) {
      throw new Error("Queue name is required")
    }

    const queueClient = this.getQueueClient(queueName)
    return await queueClient.exists()
  }

  /**
   * Gets the approximate number of messages in a queue
   * @param {string} queueName - The name of the queue
   * @returns {Promise<number>} - The approximate message count
   * @throws {Error} If queue name is missing
   */
  async getMessageCount(queueName: string): Promise<number> {
    if (!queueName) {
      throw new Error("Queue name is required")
    }

    const queueClient = this.getQueueClient(queueName)
    const properties = await queueClient.getProperties()
    return properties.approximateMessagesCount || 0
  }
}
