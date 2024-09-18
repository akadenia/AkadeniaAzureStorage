
## Installation
```
npm install @akadenia/azure --save
```



## BlobStorage
BlobStorage - A class that contains azure blob storage helpers

**Kind**: global class  

* BlobStorage
    * .getBlobServiceUrl(sasUrl: optional) ⇒ `BlobServiceClient`
    * .listBlobs(containerName, blobNamePrefix, sasUrl: optional) ⇒ `Promise<Array<BlobItem>>`
    * .downloadBlob(containerName, blobName, sasUrl: optional) ⇒ `Promise<Buffer>`
    * .blobExists(containerName, blobName, sasUrl: optional) ⇒ `Promise<boolean>`
    * .upload(containerName, blobName, body, contentLength, contentType) ⇒ `Promise<boolean>`
    * .uploadData(containerName, blobName, data, sasUrl: optional, bufferSize) ⇒ `Promise<boolean>`
    * .uploadStream(containerName, blobName, stream, sasUrl: optional, bufferSize) ⇒ `Promise<boolean>`
    * .generateSASUrl(containerName, blobName, sasOptions) ⇒ `string`



### getBlobServiceUrl(sasUrl: optional)
**Kind**: instance method of `BlobStorage`  
**Returns**: `BlobServiceClient` - - A BlobServiceClient object  
**Params**

- sasUrl: optional `string` - Will construct the blob service client using the sas url if exists, the connection string otherwise



### listBlobs(containerName, blobNamePrefix, sasUrl: optional)
**Kind**: instance method of `BlobStorage`  
**Returns**: `Promise<Array<BlobItem>>` - - An array of BlobItem objects  
**Params**

- containerName `string` - The name of the container to check
- blobNamePrefix `string` - The prefix of the blob name
- sasUrl: optional `string` - Will construct the blob service client using the sas url if exists, the connection string otherwise



### downloadBlob(containerName, blobName, sasUrl: optional)
**Kind**: instance method of `BlobStorage`  
**Returns**: `Promise<Buffer>` - - A Buffer object  
**Params**

- containerName `string` - The name of the container to download from
- blobName `string` - The name of the blob to download
- sasUrl: optional `string` - Will construct the blob service client using the sas url if exists, the connection string otherwise



### blobExists(containerName, blobName, sasUrl: optional)
**Kind**: instance method of `BlobStorage`  
**Returns**: `Promise<boolean>` - - A boolean indicating whether or not the blob exists  
**Params**

- containerName `string` - The name of the container to check
- blobName `string` - The name of the blob to check
- sasUrl: optional `string` - Will construct the blob service client using the sas url if exists, the connection string otherwise



### upload(containerName, blobName, body, contentLength, contentType)
**Kind**: instance method of `BlobStorage`  
**Returns**: `Promise<boolean>` - - A boolean indicating whether or not the blob was successfully uploaded  
**Params**

- containerName `string` - The name of the container to upload to
- blobName `string` - The name of the blob to upload
- body `HttpRequestBody` - The body of the blob
- contentLength `string` - The content length
- contentType `string` - The content type of the blob



### uploadData(containerName, blobName, data, sasUrl: optional, bufferSize)
**Kind**: instance method of `BlobStorage`  
**Returns**: `Promise<boolean>` - - A boolean indicating whether or not the blob was successfully uploaded  
**Params**

- containerName `string` - The name of the container to upload to
- blobName `string` - The name of the blob to upload
- data - Buffer | Blob | ArrayBuffer | ArrayBufferView
- sasUrl: optional `string` - Will construct the blob service client using the sas url if exists, the connection string otherwise
- bufferSize - Size of every buffer allocated, also the block size in the uploaded block blob. Default value is 8MB



### uploadStream(containerName, blobName, stream, sasUrl: optional, bufferSize)
**Kind**: instance method of `BlobStorage`  
**Returns**: `Promise<boolean>` - - A boolean indicating whether or not the blob was successfully uploaded  
**Params**

- containerName `string` - The name of the container to upload to
- blobName `string` - The name of the blob to upload
- stream - Node.js Readable stream
- sasUrl: optional `string` - Will construct the blob service client using the sas url if exists, the connection string otherwise
- bufferSize - Size of every buffer allocated, also the block size in the uploaded block blob. Default value is 8MB



### generateSASUrl(containerName, blobName, sasOptions)
**Kind**: instance method of `BlobStorage`  
**Returns**: `string` - -The URL for the blob.  
**Params**

- containerName `string` - The name of the blob container.
- blobName `string` - The name of the blob.
- sasOptions `SASOptions` - The options used for generating the SAS query.



## QueueStorage
QueueStorage - A class that contains azure queue storage helpers

**Kind**: global class  

* QueueStorage
    * .getQueueClient() ⇒ `QueueClient`
    * .sendMessage(message) ⇒ `Promise<any>`



### getQueueClient()
**Kind**: instance method of `QueueStorage`  
**Returns**: `QueueClient` - - A QueueClient object  


### sendMessage(message)
**Kind**: instance method of `QueueStorage`  
**Returns**: `Promise<any>` - - The response from the queue  
**Params**

- message `string` - The message to send



## TableStorage
TableStorage - A class that contains azure table storage helpers

**Kind**: global class  

* TableStorage
    * .getTableClient() ⇒ `TableClient`
    * .createTable() ⇒ `Promise<void>` \| `Promise<boolean>`
    * .deleteTable() ⇒ `Promise<void>` \| `Promise<boolean>`
    * .insert(entity) ⇒ `Promise<boolean>`
    * .update(entity) ⇒ `Promise<boolean>`
    * .upsert(entity) ⇒ `Promise<boolean>`
    * .delete(partitionKey, rowKey) ⇒ `Promise<ITableEntity>`
    * .get(partitionKey, rowKey) ⇒ `Promise<ITableEntity>`



### getTableClient()
**Kind**: instance method of `TableStorage`  
**Returns**: `TableClient` - - A TableClient object  


### createTable()
Creates a table in the storage account

**Kind**: instance method of `TableStorage`  
**Returns**: `Promise<void>` - - A promise that resolves when the table is created`Promise<boolean>` - - A promise that resolves to true if the table was created  


### deleteTable()
Deletes a table in the storage account

**Kind**: instance method of `TableStorage`  
**Returns**: `Promise<void>` - - A promise that resolves when the table is deleted`Promise<boolean>` - - A promise that resolves to true if the table was deleted  


### insert(entity)
**Kind**: instance method of `TableStorage`  
**Returns**: `Promise<boolean>` - - A promise that resolves to true if the entity was inserted  
**Params**

- entity `ITableEntity` - The entity to insert



### update(entity)
**Kind**: instance method of `TableStorage`  
**Returns**: `Promise<boolean>` - - A promise that resolves to true if the entity was updated  
**Params**

- entity `ITableEntity` - The entity to update



### upsert(entity)
**Kind**: instance method of `TableStorage`  
**Returns**: `Promise<boolean>` - - A promise that resolves to true if the entity was upserted  
**Params**

- entity `ITableEntity` - The entity to upsert



### delete(partitionKey, rowKey)
**Kind**: instance method of `TableStorage`  
**Returns**: `Promise<ITableEntity>` - - The deleted entity  
**Params**

- partitionKey `string` - The partition key
- rowKey `string` - The row key



### get(partitionKey, rowKey)
**Kind**: instance method of `TableStorage`  
**Returns**: `Promise<ITableEntity>` - - The retrieved entity  
**Params**

- partitionKey `string` - The partition key
- rowKey `string` - The row key


## License
MIT: optional(https://github.com/akadenia/AkadeniaAzureStorage/blob/main/LICENSE)

