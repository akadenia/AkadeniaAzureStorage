<div align="center">
  <img src="https://cdn.akadenia.com/images/akadenia-webp/logo/horizontal-logo.svg" alt="Akadenia" width="200" />

  ## @akadenia/azure-storage

  <img src="https://cdn.akadenia.com/images/badges/npm-version-azure-storage.svg" alt="npm version" />
  <img src="https://cdn.akadenia.com/images/badges/license-mit.svg" alt="License: MIT" />
  <img src="https://cdn.akadenia.com/images/badges/typescript.svg" alt="TypeScript" />

  A TypeScript library that wraps Azure Blob, Table, and Queue Storage with a clean, consistent API. Supports both connection strings and Managed Identity — so it works the same in local dev and production Azure environments.

  [Documentation](https://akadenia.com/packages/akadenia-azure-storage) · [GitHub](https://github.com/akadenia/AkadeniaAzureStorage) · [Issues](https://github.com/akadenia/AkadeniaAzureStorage/issues)
</div>

---

## Installation

```bash
npm install @akadenia/azure-storage
```

## Quick Start

```typescript
import { BlobStorage, TableStorage, QueueStorage } from "@akadenia/azure-storage"

// Connection string (local dev / simple setups)
const blob = new BlobStorage("DefaultEndpointsProtocol=https;AccountName=...;AccountKey=...;")

// Managed Identity (recommended for production Azure workloads)
const blob = new BlobStorage({ accountName: "mystorageaccount" })
```

---

## Blob Storage

```typescript
const blob = new BlobStorage(connectionString)

// Upload
await blob.upload("my-container", "file.pdf", buffer, buffer.length, "application/pdf")
await blob.uploadData("my-container", "image.png", buffer, { blobContentType: "image/png" })
await blob.uploadStream("my-container", "video.mp4", readableStream)

// Download
const buffer = await blob.downloadBlob("my-container", "file.pdf")

// List
const blobs = await blob.listBlobs("my-container", "prefix/")

// Check existence
const exists = await blob.blobExists("my-container", "file.pdf")

// Delete
await blob.deleteBlob("my-container", "file.pdf")

// SAS URL (read-only by default, 1 hour expiry)
const { fullUrlWithSAS } = await blob.generateSASUrl("my-container", "file.pdf", {
  permissions: [BlobPermissions.READ],
  expiresOn: new Date(Date.now() + 3600 * 1000),
})

// Container management
await blob.createContainer("my-container")
await blob.deleteContainer("my-container")
```

### SAS Permissions

```typescript
import { BlobPermissions } from "@akadenia/azure-storage"

BlobPermissions.READ    // "r"
BlobPermissions.WRITE   // "w"
BlobPermissions.CREATE  // "c"
BlobPermissions.DELETE  // "d"
BlobPermissions.ADD     // "a"
```

> When using Managed Identity, `generateSASUrl` automatically uses a User Delegation SAS (more secure than account-key-based SAS).

---

## Table Storage

```typescript
const table = new TableStorage(connectionString, "MyTable")
// or with Managed Identity:
const table = new TableStorage({ accountName: "mystorageaccount", tableName: "MyTable" })

// Create / delete table
await table.createTable()
await table.deleteTable()

// CRUD
await table.insert({ partitionKey: "users", rowKey: "user-1", name: "Alice" })
await table.update({ partitionKey: "users", rowKey: "user-1", name: "Alice Smith" })
await table.upsert({ partitionKey: "users", rowKey: "user-1", name: "Alice" })
await table.delete("users", "user-1")

// Query
const entity = await table.get("users", "user-1")
const all = await table.list({ queryOptions: { filter: "PartitionKey eq 'users'" } })
```

---

## Queue Storage

```typescript
const queue = new QueueStorage(connectionString)
// or with Managed Identity:
const queue = new QueueStorage({ accountName: "mystorageaccount" })

// Send (base64 encoded by default)
await queue.sendMessage("my-queue", { type: "email", to: "user@example.com" })
await queue.sendMessage("my-queue", "plain text", false) // skip base64

// Receive & delete
const { receivedMessageItems } = await queue.receiveMessages("my-queue", 5)
await queue.deleteMessage("my-queue", messageId, popReceipt)

// Peek without consuming
const { peekedMessageItems } = await queue.peekMessages("my-queue", 3)

// Queue management
await queue.createQueue("my-queue")
await queue.clearMessages("my-queue")
await queue.deleteQueue("my-queue")
const count = await queue.getMessageCount("my-queue")
const exists = await queue.queueExists("my-queue")
```

---

## Authentication

### Connection String

```typescript
const storage = new BlobStorage("DefaultEndpointsProtocol=https;AccountName=myaccount;AccountKey=mykey;EndpointSuffix=core.windows.net")
```

### Managed Identity (recommended for Azure-hosted apps)

```typescript
// System-assigned identity
const storage = new BlobStorage({ accountName: "myaccount" })

// User-assigned identity
const storage = new BlobStorage({
  accountName: "myaccount",
  managedIdentityClientId: "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
})
```

### Local Emulator (Azurite)

```typescript
const storage = new BlobStorage("UseDevelopmentStorage=true")
// or
const storage = new BlobStorage("AccountName=devstoreaccount1;...")
```

---

## Requirements

- Node.js >= 20
- Azure Storage account (or Azurite for local development)

## License

[MIT](LICENSE)
