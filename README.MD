<div align="center">
  <img src="https://cdn.akadenia.com/images/akadenia-webp/logo/horizontal-logo.svg" alt="Akadenia" width="200" />
  
  <h2><code>@akadenia/azure-storage</code></h2>
  
  <img src="https://cdn.akadenia.com/images/badges/npm-version-azure-storage.svg" alt="npm version" />
  <img src="https://cdn.akadenia.com/images/badges/license-mit.svg" alt="License: MIT" />
  <img src="https://cdn.akadenia.com/images/badges/typescript.svg" alt="TypeScript" />
  
  A TypeScript library that wraps Azure Blob, Table, and Queue Storage with a clean, consistent API. Supports both connection strings and Managed Identity — so it works the same in local dev and production Azure environments.

  [Documentation](https://akadenia.com/packages/akadenia-azure-storage) · [GitHub](https://github.com/akadenia/AkadeniaAzureStorage) · [Issues](https://github.com/akadenia/AkadeniaAzureStorage/issues)
</div>

## Features

- **Blob Storage**: Upload, download, list, and manage blobs with SAS URL support
- **Table Storage**: Complete CRUD operations for Azure Table Storage
- **Queue Storage**: Send, receive, and manage queue messages
- **Managed Identity Support**: Passwordless authentication using Azure Managed Identity (system-assigned and user-assigned)
- **SAS URL Support**: Generate Shared Access Signature URLs — User Delegation SAS with Managed Identity, Service SAS with connection strings
- **TypeScript Support**: Full type definitions included
- **Error Handling**: Built-in error handling and validation

## Table of Contents

- [Installation](#installation)
- [Quick Start](#quick-start)
- [Blob Storage](#blob-storage)
- [Table Storage](#table-storage)
- [Queue Storage](#queue-storage)
- [Configuration](#configuration)
- [Error Handling](#error-handling)
- [Best Practices](#best-practices)
- [API Reference](#api-reference)
- [Contributing](#contributing)
- [License](#license)

## Installation

```bash
npm install @akadenia/azure-storage --save
```

## Quick Start

### Prerequisites

You can authenticate using either:
- **Connection String**: Get this from the Azure Portal under your storage account's "Access keys" section
- **Managed Identity**: For applications running in Azure (recommended for production)

**Option 1: Connection string**

```typescript
import { BlobStorage, TableStorage, QueueStorage } from '@akadenia/azure-storage';

const connectionString = "DefaultEndpointsProtocol=https;AccountName=yourstorageaccount;AccountKey=yourkey;EndpointSuffix=core.windows.net";

const blobStorage  = new BlobStorage(connectionString);
const tableStorage = new TableStorage(connectionString, 'tableName');
const queueStorage = new QueueStorage(connectionString);
```

**Option 2: Managed Identity (recommended for production)**

```typescript
import { BlobStorage, TableStorage, QueueStorage } from '@akadenia/azure-storage';

const blobStorage  = new BlobStorage({ accountName: 'yourstorageaccount' });
const tableStorage = new TableStorage({ accountName: 'yourstorageaccount', tableName: 'tableName' });
const queueStorage = new QueueStorage({ accountName: 'yourstorageaccount' });
```

---

## Blob Storage

The `BlobStorage` class provides methods to interact with Azure Blob Storage.

### Basic Setup

```typescript
import { BlobStorage } from '@akadenia/azure-storage';

const blobStorage = new BlobStorage(connectionString);
```

### Container Operations

```typescript
// Create a container
const containerCreated = await blobStorage.createContainer('my-container');
console.log('Container created:', containerCreated);

// Delete a container
const containerDeleted = await blobStorage.deleteContainer('my-container');
console.log('Container deleted:', containerDeleted);
```

### Upload Operations

```typescript
// Upload data from Buffer
const data = Buffer.from('Hello, Azure Blob Storage!');
const uploaded = await blobStorage.uploadData('my-container', 'my-blob.txt', data, {
  blobContentType: 'text/plain'
});

// Upload from stream
import { Readable } from 'stream';
const stream = Readable.from(['Stream data content']);
await blobStorage.uploadStream('my-container', 'stream-blob.txt', stream, {
  blobContentType: 'text/plain'
});

// Upload with additional headers
await blobStorage.uploadData('my-container', 'document.pdf', pdfBuffer, {
  blobContentType: 'application/pdf',
  blobCacheControl: 'max-age=3600',
  blobContentEncoding: 'gzip'
});

// Legacy upload method
await blobStorage.upload('my-container', 'file.pdf', buffer, buffer.length, 'application/pdf');
```

### Download Operations

```typescript
// Download blob as Buffer
const blobData = await blobStorage.downloadBlob('my-container', 'my-blob.txt');
console.log('Downloaded content:', blobData.toString());

// Check if blob exists before downloading
const exists = await blobStorage.blobExists('my-container', 'my-blob.txt');
if (exists) {
  const data = await blobStorage.downloadBlob('my-container', 'my-blob.txt');
}
```

### List Operations

```typescript
// List all blobs with a prefix
const blobs = await blobStorage.listBlobs('my-container', 'documents/');
blobs.forEach(blob => {
  console.log(`Blob: ${blob.name}, Size: ${blob.properties.contentLength}`);
});
```

### Delete Operations

```typescript
const deleted = await blobStorage.deleteBlob('my-container', 'my-blob.txt');
console.log('Blob deleted:', deleted);
```

### SAS URL Generation

`generateSASUrl` supports two SAS token types automatically:
- **User Delegation SAS** — used with Managed Identity (more secure, no account keys)
- **Service SAS** — used with connection string authentication

```typescript
import { BlobPermissions } from '@akadenia/azure-storage';

// Read-only SAS, 1 hour expiry
const sasUrl = await blobStorage.generateSASUrl('my-container', 'my-blob.txt', {
  startsOn: new Date(),
  expiresOn: new Date(Date.now() + 3600 * 1000),
  permissions: [BlobPermissions.READ]
});
console.log('SAS URL:', sasUrl.fullUrlWithSAS);

// Write-enabled container-level SAS
const containerSas = await blobStorage.generateSASUrl('my-container', undefined, {
  permissions: [BlobPermissions.ADD, BlobPermissions.WRITE],
  expiresOn: new Date(Date.now() + 24 * 3600 * 1000)
});
```

#### SAS Permissions

```typescript
import { BlobPermissions } from '@akadenia/azure-storage';

BlobPermissions.READ    // "r"
BlobPermissions.WRITE   // "w"
BlobPermissions.CREATE  // "c"
BlobPermissions.DELETE  // "d"
BlobPermissions.ADD     // "a"
```

---

## Table Storage

The `TableStorage` class provides methods to interact with Azure Table Storage.

### Basic Setup

```typescript
import { TableStorage, ITableEntity } from '@akadenia/azure-storage';

const tableStorage = new TableStorage(connectionString, 'MyTable');
```

### Table Management

```typescript
const tableCreated = await tableStorage.createTable();
const tableDeleted = await tableStorage.deleteTable();
```

### Entity Operations

```typescript
interface UserEntity extends ITableEntity {
  partitionKey: string;
  rowKey: string;
  name: string;
  email: string;
  age: number;
  isActive: boolean;
}

// Insert
const user: UserEntity = {
  partitionKey: 'users',
  rowKey: 'user-123',
  name: 'John Doe',
  email: 'john@example.com',
  age: 30,
  isActive: true
};
await tableStorage.insert(user);

// Get
const retrievedUser = await tableStorage.get('users', 'user-123');

// Update
user.age = 31;
await tableStorage.update(user);

// Upsert (insert or update)
await tableStorage.upsert(newUser);

// Delete
await tableStorage.delete('users', 'user-123');
```

### List Operations

```typescript
// List all entities
const allUsers = await tableStorage.list<UserEntity>();

// List with filter
const activeUsers = await tableStorage.list<UserEntity>({
  queryOptions: { filter: "isActive eq true and age gt 25" }
});

// Access underlying TableClient for advanced operations
const tableClient = tableStorage.getTableClient();
```

---

## Queue Storage

The `QueueStorage` class provides methods to interact with Azure Queue Storage.

### Basic Setup

```typescript
import { QueueStorage } from '@akadenia/azure-storage';

const queueStorage = new QueueStorage(connectionString);
// or with Managed Identity:
const queueStorage = new QueueStorage({ accountName: 'yourstorageaccount' });
```

### Message Operations

```typescript
// Send a string message (base64 encoded by default)
await queueStorage.sendMessage('my-queue', 'Hello, Queue!');

// Send an object (auto JSON stringified + base64 encoded)
await queueStorage.sendMessage('my-queue', { orderNumber: '12345', action: 'process' });

// Send without base64 encoding
await queueStorage.sendMessage('my-queue', 'plain text', false);

// Receive messages
const { receivedMessageItems } = await queueStorage.receiveMessages('my-queue', 5, 30);

// Process and delete
for (const message of receivedMessageItems) {
  const decoded = Buffer.from(message.messageText, 'base64').toString('utf-8');
  const data = JSON.parse(decoded);
  // ... process data ...
  await queueStorage.deleteMessage('my-queue', message.messageId, message.popReceipt);
}

// Peek without consuming
const { peekedMessageItems } = await queueStorage.peekMessages('my-queue', 5);
```

### Queue Management

```typescript
await queueStorage.createQueue('my-new-queue');

const exists = await queueStorage.queueExists('my-queue');
const count  = await queueStorage.getMessageCount('my-queue');

await queueStorage.clearMessages('my-queue');
await queueStorage.deleteQueue('old-queue');

// Access underlying QueueClient for advanced options
const queueClient = queueStorage.getQueueClient('my-queue');
await queueClient.sendMessage('Custom', {
  visibilityTimeoutInSeconds: 30,
  timeToLiveInSeconds: 3600
});
```

### Integration Example: Order Processing Pipeline

```typescript
class OrderProcessor {
  private queueStorage: QueueStorage;

  constructor(connectionString: string) {
    this.queueStorage = new QueueStorage(connectionString);
  }

  async queueOrder(orderNumber: string): Promise<void> {
    await this.queueStorage.sendMessage('orders-to-process', { orderNumber, timestamp: Date.now() });
  }

  async processOrders(): Promise<void> {
    const { receivedMessageItems } = await this.queueStorage.receiveMessages('orders-to-process', 10);

    for (const message of receivedMessageItems) {
      try {
        const decoded = Buffer.from(message.messageText, 'base64').toString('utf-8');
        const order = JSON.parse(decoded);
        console.log(`Processing order ${order.orderNumber}`);
        await this.queueStorage.deleteMessage('orders-to-process', message.messageId, message.popReceipt);
      } catch (error) {
        console.error('Failed to process message:', error);
        // Message will become visible again after visibility timeout
      }
    }
  }
}
```

---

## Configuration

### Environment Variables

```typescript
const connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING;
if (!connectionString) throw new Error('AZURE_STORAGE_CONNECTION_STRING is required');
```

### Local Development with Azurite

```typescript
const blobStorage  = new BlobStorage("UseDevelopmentStorage=true");
const tableStorage = new TableStorage("UseDevelopmentStorage=true", 'MyTable');
const queueStorage = new QueueStorage("UseDevelopmentStorage=true");
```

### Managed Identity Authentication

#### System-Assigned (Most Common)

Automatically created when you enable managed identity on your Azure resource — no client ID needed.

```typescript
const blobStorage  = new BlobStorage({ accountName: 'yourstorageaccount' });
const tableStorage = new TableStorage({ accountName: 'yourstorageaccount', tableName: 'MyTable' });
const queueStorage = new QueueStorage({ accountName: 'yourstorageaccount' });
```

#### User-Assigned

A standalone identity shared across multiple Azure resources. Requires the client ID.

```typescript
const blobStorage = new BlobStorage({
  accountName: 'yourstorageaccount',
  managedIdentityClientId: 'your-client-id'
});
```

#### Environment-Based Configuration

```typescript
const blobStorage = process.env.NODE_ENV === 'production'
  ? new BlobStorage({ accountName: process.env.AZURE_STORAGE_ACCOUNT_NAME! })
  : new BlobStorage(process.env.AZURE_STORAGE_CONNECTION_STRING!);
```

> **Note:** When using Managed Identity, ensure your Azure resource has the appropriate role assignments:
> - **Storage Blob Data Contributor** for Blob Storage
> - **Storage Table Data Contributor** for Table Storage

---

## Error Handling

```typescript
try {
  const blobData = await blobStorage.downloadBlob('container', 'non-existent.txt');
} catch (error) {
  if (error.statusCode === 404) {
    console.log('Blob not found');
  } else {
    console.error('Error downloading blob:', error);
  }
}
```

---

## Best Practices

### 1. Use Managed Identity in Production

```typescript
const blobStorage = process.env.NODE_ENV === 'production'
  ? new BlobStorage({ accountName: process.env.AZURE_STORAGE_ACCOUNT_NAME! })
  : new BlobStorage(process.env.AZURE_STORAGE_CONNECTION_STRING!);
```

### 2. Short-Lived SAS URLs

```typescript
const sasUrl = await blobStorage.generateSASUrl('container', 'blob', {
  permissions: [BlobPermissions.READ],
  expiresOn: new Date(Date.now() + 3600 * 1000) // 1 hour max
});
```

### 3. Always Handle Errors

```typescript
async function safeUpload(container: string, name: string, data: Buffer) {
  try {
    return await blobStorage.uploadData(container, name, data);
  } catch (error) {
    console.error('Upload failed:', error);
    throw error;
  }
}
```

### 4. Clean Up Temporary Resources

```typescript
async function cleanup() {
  try {
    await blobStorage.deleteContainer('temp-container');
    await tableStorage.deleteTable();
  } catch (error) {
    console.error('Cleanup failed:', error);
  }
}
```

---

## API Reference

### BlobStorage

| Method | Description | Returns |
|---|---|---|
| `createContainer(containerName)` | Creates a container if it doesn't exist | `Promise<boolean>` |
| `deleteContainer(containerName)` | Deletes a container | `Promise<boolean>` |
| `upload(container, blob, buffer, length, contentType)` | Uploads a buffer (legacy) | `Promise<boolean>` |
| `uploadData(container, blob, data, headers?)` | Uploads a Buffer with optional headers | `Promise<boolean>` |
| `uploadStream(container, blob, stream, headers?)` | Uploads a readable stream | `Promise<boolean>` |
| `downloadBlob(container, blob)` | Downloads a blob as Buffer | `Promise<Buffer>` |
| `blobExists(container, blob)` | Checks if a blob exists | `Promise<boolean>` |
| `listBlobs(container, prefix)` | Lists blobs with a prefix | `Promise<BlobItem[]>` |
| `deleteBlob(container, blob)` | Deletes a blob | `Promise<boolean>` |
| `generateSASUrl(container, blob?, options?)` | Generates a SAS URL | `Promise<SASUrlComponents>` |

### TableStorage

| Method | Description | Returns |
|---|---|---|
| `createTable()` | Creates the table | `Promise<boolean>` |
| `deleteTable()` | Deletes the table | `Promise<boolean>` |
| `insert(entity)` | Inserts an entity | `Promise<boolean>` |
| `update(entity)` | Updates an entity | `Promise<boolean>` |
| `upsert(entity)` | Inserts or updates an entity | `Promise<boolean>` |
| `get(partitionKey, rowKey)` | Gets an entity | `Promise<GetTableEntityResponse>` |
| `delete(partitionKey, rowKey)` | Deletes an entity | `Promise<boolean>` |
| `list(options?)` | Lists entities with optional filter | `Promise<T[]>` |
| `getTableClient()` | Returns the underlying TableClient | `TableClient` |

### QueueStorage

| Method | Description | Returns |
|---|---|---|
| `getQueueClient(queueName)` | Gets a QueueClient | `QueueClient` |
| `sendMessage(queue, message, base64Encode?)` | Sends a message | `Promise<QueueSendMessageResponse>` |
| `receiveMessages(queue, maxMessages?, visibilityTimeout?)` | Receives messages | `Promise<any>` |
| `deleteMessage(queue, messageId, popReceipt)` | Deletes a message | `Promise<void>` |
| `peekMessages(queue, maxMessages?)` | Peeks messages without consuming | `Promise<any>` |
| `clearMessages(queue)` | Clears all messages | `Promise<void>` |
| `createQueue(queue)` | Creates a queue | `Promise<void>` |
| `deleteQueue(queue)` | Deletes a queue | `Promise<void>` |
| `queueExists(queue)` | Checks if a queue exists | `Promise<boolean>` |
| `getMessageCount(queue)` | Gets approximate message count | `Promise<number>` |

---

## Contributing

We welcome contributions! Please feel free to submit a Pull Request.

### Development Setup

```bash
git clone https://github.com/akadenia/AkadeniaAzureStorage.git
cd AkadeniaAzureStorage
npm install
npm run build
npm run test:with-azurite  # requires Azurite running locally
```

### Commit Message Guidelines

We follow [Conventional Commits](https://www.conventionalcommits.org/). Scope is required.

```text
type(scope): description
```

**Common scopes:** `blob` · `table` · `queue` · `docs` · `deps` · `test` · `build` · `ci`

**Types:** `feat` · `fix` · `docs` · `style` · `refactor` · `test` · `chore`

## Requirements

- Node.js >= 20
- Azure Storage account (or Azurite for local development)

## License

[MIT](https://github.com/akadenia/AkadeniaAzureStorage/blob/main/LICENSE)

## Support

For support, please open an issue on [GitHub](https://github.com/akadenia/AkadeniaAzureStorage/issues).
