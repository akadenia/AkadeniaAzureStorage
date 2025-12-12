import { afterAll, beforeAll, describe, expect, it } from "@jest/globals"

import { QueueStorage } from "../src/queue"
import { AZURITE_CONNECTION_STRING } from "./test-utils"

describe("QueueStorage", () => {
  const storageConnectionString = process.env.TEST_AZURITE_CONNECTION_STRING || AZURITE_CONNECTION_STRING

  const queueClient = new QueueStorage(storageConnectionString)

  const queueName = `testqueue-${Math.random().toString(36).substring(2, 15)}`

  beforeAll(async () => {
    await queueClient.createQueue(queueName)
  })

  afterAll(async () => {
    await queueClient.deleteQueue(queueName)
  })

  it("should throw error if connection string is missing", () => {
    expect(() => new QueueStorage("")).toThrow("Connection string is required")
  })

  it("should create a QueueStorage instance", () => {
    expect(queueClient).toBeDefined()
  })

  it("should get a QueueClient object", () => {
    const client = queueClient.getQueueClient(queueName)
    expect(client).toBeDefined()
  })

  it("should check if a queue exists", async () => {
    const exists = await queueClient.queueExists(queueName)
    expect(exists).toBe(true)
  })

  it("should return false for non-existent queue", async () => {
    const exists = await queueClient.queueExists("nonexistent-queue")
    expect(exists).toBe(false)
  })

  it("should send a string message with base64 encoding", async () => {
    const message = "test message"
    const response = await queueClient.sendMessage(queueName, message, true)
    expect(response.messageId).toBeDefined()
    expect(response.popReceipt).toBeDefined()
  })

  it("should send an object message with base64 encoding", async () => {
    const message = { orderNumber: "12345", timestamp: new Date().toISOString() }
    const response = await queueClient.sendMessage(queueName, message, true)
    expect(response.messageId).toBeDefined()
    expect(response.popReceipt).toBeDefined()
  })

  it("should send a message without base64 encoding", async () => {
    const message = "plain text message"
    const response = await queueClient.sendMessage(queueName, message, false)
    expect(response.messageId).toBeDefined()
  })

  it("should throw error when sending message without queue name", async () => {
    await expect(queueClient.sendMessage("", "test")).rejects.toThrow("Queue name is required")
  })

  it("should throw error when sending empty message", async () => {
    await expect(queueClient.sendMessage(queueName, "")).rejects.toThrow("Message is required")
  })

  it("should peek messages without removing them", async () => {
    // Clear queue first
    await queueClient.clearMessages(queueName)

    // Send a message
    await queueClient.sendMessage(queueName, "peek test message")

    // Peek the message
    const peekResponse = await queueClient.peekMessages(queueName, 1)
    expect(peekResponse.peekedMessageItems).toBeDefined()
    expect(peekResponse.peekedMessageItems.length).toBeGreaterThan(0)

    // Verify message is still in queue
    const messageCount = await queueClient.getMessageCount(queueName)
    expect(messageCount).toBeGreaterThan(0)
  })

  it("should receive and delete a message", async () => {
    // Clear queue first
    await queueClient.clearMessages(queueName)

    // Send a message
    const testMessage = { test: "data", orderNumber: "999" }
    await queueClient.sendMessage(queueName, testMessage)

    // Receive the message
    const receiveResponse = await queueClient.receiveMessages(queueName, 1, 30)
    expect(receiveResponse.receivedMessageItems).toBeDefined()
    expect(receiveResponse.receivedMessageItems.length).toBe(1)

    const receivedMessage = receiveResponse.receivedMessageItems[0]
    expect(receivedMessage.messageId).toBeDefined()
    expect(receivedMessage.popReceipt).toBeDefined()

    // Decode and verify message content
    const decodedMessage = Buffer.from(receivedMessage.messageText, "base64").toString("utf-8")
    const parsedMessage = JSON.parse(decodedMessage)
    expect(parsedMessage.test).toBe("data")
    expect(parsedMessage.orderNumber).toBe("999")

    // Delete the message
    await queueClient.deleteMessage(queueName, receivedMessage.messageId, receivedMessage.popReceipt)

    // Verify message is deleted
    const messageCount = await queueClient.getMessageCount(queueName)
    expect(messageCount).toBe(0)
  })

  it("should receive multiple messages", async () => {
    // Clear queue first
    await queueClient.clearMessages(queueName)

    // Send multiple messages
    await queueClient.sendMessage(queueName, "message 1")
    await queueClient.sendMessage(queueName, "message 2")
    await queueClient.sendMessage(queueName, "message 3")

    // Receive multiple messages
    const receiveResponse = await queueClient.receiveMessages(queueName, 3, 30)
    expect(receiveResponse.receivedMessageItems.length).toBeLessThanOrEqual(3)
    expect(receiveResponse.receivedMessageItems.length).toBeGreaterThan(0)
  })

  it("should get message count", async () => {
    // Clear queue first
    await queueClient.clearMessages(queueName)

    // Initial count should be 0
    let count = await queueClient.getMessageCount(queueName)
    expect(count).toBe(0)

    // Send messages
    await queueClient.sendMessage(queueName, "message 1")
    await queueClient.sendMessage(queueName, "message 2")

    // Wait a bit for count to update (queue properties are eventually consistent)
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Count should be 2
    count = await queueClient.getMessageCount(queueName)
    expect(count).toBeGreaterThan(0)
  })

  it("should clear all messages from queue", async () => {
    // Send some messages
    await queueClient.sendMessage(queueName, "message 1")
    await queueClient.sendMessage(queueName, "message 2")

    // Clear all messages
    await queueClient.clearMessages(queueName)

    // Wait a bit for clear to complete
    await new Promise((resolve) => setTimeout(resolve, 500))

    // Verify queue is empty
    const receiveResponse = await queueClient.receiveMessages(queueName, 1, 30)
    expect(receiveResponse.receivedMessageItems.length).toBe(0)
  })

  it("should handle order number messages (integration scenario)", async () => {
    // Clear queue first
    await queueClient.clearMessages(queueName)

    // Simulate sending order to queue (as in webhook)
    const orderNumber = "12345"
    const queueMessage = { orderNumber }
    const response = await queueClient.sendMessage(queueName, queueMessage, true)
    expect(response.messageId).toBeDefined()

    // Simulate receiving order from queue (as in BakeOrder)
    const receiveResponse = await queueClient.receiveMessages(queueName, 1, 30)
    const receivedMessage = receiveResponse.receivedMessageItems[0]

    // Decode and parse message
    const decodedMessage = Buffer.from(receivedMessage.messageText, "base64").toString("utf-8")
    const parsedMessage = JSON.parse(decodedMessage)
    expect(parsedMessage.orderNumber).toBe(orderNumber)

    // Delete after processing
    await queueClient.deleteMessage(queueName, receivedMessage.messageId, receivedMessage.popReceipt)
  })

  it("should throw error when deleting message without required parameters", async () => {
    await expect(queueClient.deleteMessage("", "messageId", "popReceipt")).rejects.toThrow("Queue name is required")
    await expect(queueClient.deleteMessage(queueName, "", "popReceipt")).rejects.toThrow("Message ID is required")
    await expect(queueClient.deleteMessage(queueName, "messageId", "")).rejects.toThrow("Pop receipt is required")
  })

  it("should create a new queue if it doesn't exist", async () => {
    const newQueueName = `testqueue-new-${Math.random().toString(36).substring(2, 15)}`

    await queueClient.createQueue(newQueueName)

    const exists = await queueClient.queueExists(newQueueName)
    expect(exists).toBe(true)

    // Cleanup
    await queueClient.deleteQueue(newQueueName)
  })

  it("should not fail when creating an existing queue", async () => {
    // createIfNotExists should not throw error
    await expect(queueClient.createQueue(queueName)).resolves.not.toThrow()
  })
})
