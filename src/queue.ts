import { QueueClient } from "@azure/storage-queue"

export class AzureQueue {
  private queueClient: QueueClient

  constructor(connectionString: string, queueName: string) {
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
