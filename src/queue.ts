import { QueueClient } from "@azure/storage-queue"

/**
 * @class QueueStorage - A class that contains azure queue storage helpers
 */
export class QueueStorage {
  private queueClient: QueueClient

  constructor(connectionString: string, queueName: string) {
    if (!connectionString) {
      throw new Error("Missing connection string")
    }
    if (!queueName) {
      throw new Error("Missing queue name")
    }
    this.queueClient = new QueueClient(connectionString, queueName)
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
}
