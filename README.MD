# @akadenia/azure-storage

A comprehensive TypeScript library providing simplified helper methods for Microsoft Azure Storage services including Blob Storage, Table Storage, and Queue Storage.

## Features

- **Blob Storage**: Upload, download, list, and manage blobs with SAS URL support
- **Table Storage**: Complete CRUD operations for Azure Table Storage
- **Queue Storage**: Send, receive, and manage queue messages
- **TypeScript Support**: Full type definitions included
- **SAS URL Support**: Generate and use Shared Access Signature URLs for secure access
- **Error Handling**: Built-in error handling and validation

## Installation

```bash
npm install @akadenia/azure-storage --save
```

## Quick Start

### Prerequisites

You'll need an Azure Storage Account connection string. You can get this from the Azure Portal under your storage account's "Access keys" section.

```typescript
import { BlobStorage, TableStorage, QueueStorage } from '@akadenia/azure-storage';

// Your Azure Storage connection string
const connectionString = "DefaultEndpointsProtocol=https;AccountName=yourstorageaccount;AccountKey=yourkey;EndpointSuffix=core.windows.net";
```

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
const uploaded = await blobStorage.uploadData(
  'my-container',
  'my-blob.txt',
  data,
  { blobContentType: 'text/plain' }
);
console.log('Upload successful:', uploaded);

// Upload from stream
import { Readable } from 'stream';
const stream = Readable.from(['Stream data content']);
const streamUploaded = await blobStorage.uploadStream(
  'my-container',
  'stream-blob.txt',
  stream,
  { blobContentType: 'text/plain' }
);

// Upload with custom headers
const uploadedWithHeaders = await blobStorage.uploadData(
  'my-container',
  'document.pdf',
  pdfBuffer,
  {
    blobContentType: 'application/pdf',
    blobCacheControl: 'max-age=3600',
    blobContentEncoding: 'gzip'
  }
);
```

### Download Operations

```typescript
// Download blob as Buffer
const blobData = await blobStorage.downloadBlob('my-container', 'my-blob.txt');
console.log('Downloaded content:', blobData.toString());

// Check if blob exists
const exists = await blobStorage.blobExists('my-container', 'my-blob.txt');
console.log('Blob exists:', exists);
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
// Delete a blob
const deleted = await blobStorage.deleteBlob('my-container', 'my-blob.txt');
console.log('Blob deleted:', deleted);
```

### SAS URL Generation

```typescript
import { BlobPermissions } from '@akadenia/azure-storage';

// Generate SAS URL for read access
const sasOptions = {
  startsOn: new Date(),
  expiresOn: new Date(Date.now() + 3600 * 1000), // 1 hour
  permissions: [BlobPermissions.READ]
};

const sasUrl = blobStorage.generateSASUrl('my-container', 'my-blob.txt', sasOptions);
console.log('SAS URL:', sasUrl.fullUrlWithSAS);

// Use SAS URL for secure access
const sasBlobStorage = new BlobStorage(sasUrl.fullUrlWithSAS);
const secureData = await sasBlobStorage.downloadBlob('my-container', 'my-blob.txt');
```

### Advanced SAS Examples

```typescript
// Generate container-level SAS with write permissions
const containerSasOptions = {
  permissions: [BlobPermissions.ADD, BlobPermissions.WRITE],
  expiresOn: new Date(Date.now() + 24 * 3600 * 1000) // 24 hours
};

const containerSas = blobStorage.generateSASUrl('my-container', undefined, containerSasOptions);
const sasClient = new BlobStorage(containerSas.fullUrlWithSAS);

// Upload using SAS URL
await sasClient.uploadData('my-container', 'secure-upload.txt', Buffer.from('Secure content'));
```


## Table Storage

The `TableStorage` class provides methods to interact with Azure Table Storage.

### Basic Setup

```typescript
import { TableStorage, ITableEntity } from '@akadenia/azure-storage';

const tableStorage = new TableStorage(connectionString, 'MyTable');
```

### Table Management

```typescript
// Create a table
const tableCreated = await tableStorage.createTable();
console.log('Table created:', tableCreated);

// Delete a table
const tableDeleted = await tableStorage.deleteTable();
console.log('Table deleted:', tableDeleted);
```

### Entity Operations

```typescript
// Define an entity
interface UserEntity extends ITableEntity {
  partitionKey: string;
  rowKey: string;
  name: string;
  email: string;
  age: number;
  isActive: boolean;
}

// Insert an entity
const user: UserEntity = {
  partitionKey: 'users',
  rowKey: 'user-123',
  name: 'John Doe',
  email: 'john@example.com',
  age: 30,
  isActive: true
};

const inserted = await tableStorage.insert(user);
console.log('User inserted:', inserted);

// Get an entity
const retrievedUser = await tableStorage.get('users', 'user-123');
console.log('Retrieved user:', retrievedUser);

// Update an entity
user.age = 31;
user.name = 'John Smith';
const updated = await tableStorage.update(user);
console.log('User updated:', updated);

// Upsert an entity (insert or update)
const newUser: UserEntity = {
  partitionKey: 'users',
  rowKey: 'user-456',
  name: 'Jane Doe',
  email: 'jane@example.com',
  age: 25,
  isActive: true
};

const upserted = await tableStorage.upsert(newUser);
console.log('User upserted:', upserted);

// Delete an entity
const deleted = await tableStorage.delete('users', 'user-123');
console.log('User deleted:', deleted);
```

### List Operations

```typescript
// List all entities
const allUsers = await tableStorage.list<UserEntity>();
console.log('All users:', allUsers);

// List with options
const usersWithOptions = await tableStorage.list<UserEntity>({
  queryOptions: { filter: "age gt 25" }
});
console.log('Users over 25:', usersWithOptions);
```

### Advanced Table Examples

```typescript
// Batch operations example
const users = [
  { partitionKey: 'users', rowKey: 'user-1', name: 'Alice', age: 28 },
  { partitionKey: 'users', rowKey: 'user-2', name: 'Bob', age: 32 },
  { partitionKey: 'users', rowKey: 'user-3', name: 'Charlie', age: 24 }
];

// Insert multiple users
for (const user of users) {
  await tableStorage.insert(user);
}

// Query with filters
const youngUsers = await tableStorage.list<UserEntity>({
  queryOptions: { filter: "age lt 30" }
});

// Get table client for advanced operations
const tableClient = tableStorage.getTableClient();
// Use tableClient for more complex operations
```



## Queue Storage

The `QueueStorage` class provides methods to interact with Azure Queue Storage.

### Basic Setup

```typescript
import { QueueStorage } from '@akadenia/azure-storage';

const queueStorage = new QueueStorage(connectionString, 'my-queue');
```

### Message Operations

```typescript
// Send a message
const messageResult = await queueStorage.sendMessage('Hello, Queue Storage!');
console.log('Message sent:', messageResult);

// Send JSON message
const jsonMessage = JSON.stringify({
  id: 123,
  action: 'process',
  data: { name: 'John', age: 30 }
});
await queueStorage.sendMessage(jsonMessage);

// Receive messages
const messages = await queueStorage.receiveMessages();
console.log('Received messages:', messages);

// Process and delete messages
for (const message of messages) {
  console.log('Processing message:', message.messageText);
  
  // Process the message...
  
  // Delete the message after processing
  await queueStorage.deleteMessage(message.messageId, message.popReceipt);
}
```

### Advanced Queue Examples

```typescript
// Get queue client for advanced operations
const queueClient = queueStorage.getQueueClient();

// Send message with options
await queueClient.sendMessage('Delayed message', {
  visibilityTimeoutInSeconds: 30, // Hide for 30 seconds
  timeToLiveInSeconds: 3600 // Expire after 1 hour
});

// Peek at messages without removing them
const peekedMessages = await queueClient.peekMessages({ numberOfMessages: 5 });
console.log('Peeked messages:', peekedMessages);
```


## Configuration

### Environment Variables

```typescript
// Use environment variables for connection string
const connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING;

if (!connectionString) {
  throw new Error('AZURE_STORAGE_CONNECTION_STRING environment variable is required');
}
```

### Local Development with Azurite

For local development, you can use Azurite (Azure Storage Emulator):

```typescript
// Azurite connection string
const localConnectionString = "UseDevelopmentStorage=true";

const blobStorage = new BlobStorage(localConnectionString);
const tableStorage = new TableStorage(localConnectionString, 'MyTable');
const queueStorage = new QueueStorage(localConnectionString, 'my-queue');
```

## Error Handling

The library includes built-in error handling:

```typescript
try {
  const blobData = await blobStorage.downloadBlob('container', 'non-existent-blob.txt');
} catch (error) {
  if (error.statusCode === 404) {
    console.log('Blob not found');
  } else {
    console.error('Error downloading blob:', error);
  }
}

try {
  const user = await tableStorage.get('users', 'non-existent-user');
} catch (error) {
  if (error.statusCode === 404) {
    console.log('User not found');
  } else {
    console.error('Error retrieving user:', error);
  }
}
```

## Best Practices

### 1. Connection String Security

```typescript
// Store connection strings securely
const connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING;

// Use SAS URLs for limited access
const sasUrl = blobStorage.generateSASUrl('container', 'blob', {
  permissions: [BlobPermissions.READ],
  expiresOn: new Date(Date.now() + 3600 * 1000) // 1 hour
});
```

### 2. Error Handling

```typescript
// Always handle errors appropriately
async function safeBlobOperation() {
  try {
    const result = await blobStorage.uploadData('container', 'blob', data);
    return result;
  } catch (error) {
    console.error('Blob operation failed:', error);
    throw error;
  }
}
```

### 3. Resource Management

```typescript
// Clean up resources when done
async function cleanup() {
  try {
    await blobStorage.deleteContainer('temp-container');
    await tableStorage.deleteTable();
  } catch (error) {
    console.error('Cleanup failed:', error);
  }
}
```

### 4. Performance Optimization

```typescript
// Use appropriate buffer sizes for large files
await blobStorage.uploadStream('container', 'large-file.zip', stream, {
  blobContentType: 'application/zip'
}, 4 * 1024 * 1024); // 4MB buffer size

// Batch table operations when possible
const entities = [/* multiple entities */];
for (const entity of entities) {
  await tableStorage.upsert(entity);
}
```

## API Reference

### BlobStorage

| Method | Description | Returns |
|--------|-------------|---------|
| `createContainer(containerName)` | Creates a container if it doesn't exist | `Promise<boolean>` |
| `deleteContainer(containerName)` | Deletes a container if it exists | `Promise<boolean>` |
| `uploadData(containerName, blobName, data, headers?)` | Uploads data to a blob | `Promise<boolean>` |
| `uploadStream(containerName, blobName, stream, headers?)` | Uploads a stream to a blob | `Promise<boolean>` |
| `downloadBlob(containerName, blobName)` | Downloads a blob as Buffer | `Promise<Buffer>` |
| `blobExists(containerName, blobName)` | Checks if a blob exists | `Promise<boolean>` |
| `listBlobs(containerName, prefix)` | Lists blobs with a prefix | `Promise<BlobItem[]>` |
| `deleteBlob(containerName, blobName)` | Deletes a blob | `Promise<boolean>` |
| `generateSASUrl(containerName, blobName?, options?)` | Generates a SAS URL | `SASUrlComponents` |

### TableStorage

| Method | Description | Returns |
|--------|-------------|---------|
| `createTable()` | Creates a table | `Promise<boolean>` |
| `deleteTable()` | Deletes a table | `Promise<boolean>` |
| `insert(entity)` | Inserts an entity | `Promise<boolean>` |
| `update(entity)` | Updates an entity | `Promise<boolean>` |
| `upsert(entity)` | Inserts or updates an entity | `Promise<boolean>` |
| `get(partitionKey, rowKey)` | Gets an entity | `Promise<GetTableEntityResponse>` |
| `delete(partitionKey, rowKey)` | Deletes an entity | `Promise<boolean>` |
| `list(options?)` | Lists entities | `Promise<T[]>` |

### QueueStorage

| Method | Description | Returns |
|--------|-------------|---------|
| `sendMessage(message)` | Sends a message to the queue | `Promise<any>` |
| `receiveMessages()` | Receives messages from the queue | `Promise<any>` |
| `deleteMessage(messageId, popReceipt)` | Deletes a message | `Promise<void>` |


## License

[MIT](https://github.com/akadenia/AkadeniaAzureStorage/blob/main/LICENSE)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Support

For support, please open an issue on [GitHub](https://github.com/akadenia/AkadeniaAzureStorage/issues).
