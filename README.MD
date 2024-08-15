
## Installation

```
npm install @akadenia/azure --save
```

## Classes

### QueueStorage
QueueStorage - A class that contains azure queue storage helpers

**Kind**: global class

* [QueueStorage](#QueueStorage)
    * [.getQueueClient()](#QueueStorage+getQueueClient) ⇒ <code>QueueClient</code>
    * [.sendMessage(message)](#QueueStorage+sendMessage) ⇒ <code>Promise.&lt;any&gt;</code>


#### queueStorage.getQueueClient() ⇒ <code>QueueClient</code>
**Kind**: instance method of [<code>QueueStorage</code>](#QueueStorage)
**Returns**: <code>QueueClient</code> - - A QueueClient object

#### queueStorage.sendMessage(message) ⇒ <code>Promise.&lt;any&gt;</code>
**Kind**: instance method of [<code>QueueStorage</code>](#QueueStorage)
**Returns**: <code>Promise.&lt;any&gt;</code> - - The response from the queue

| Param   | Type                | Description         |
| ------- | ------------------- | ------------------- |
| message | <code>string</code> | The message to send |


### BlobStorage
BlobStorage - A class that contains azure blob storage helpers

**Kind**: global class


#### blobStorage.getBlobServiceUrl() ⇒ <code>BlobServiceClient</code>
**Kind**: instance method of [<code>BlobStorage</code>](#BlobStorage)
**Returns**: <code>BlobServiceClient</code> - - A BlobServiceClient object

#### blobStorage.listBlobs(containerName, blobNamePrefix) ⇒ <code>Promise.&lt;Array.&lt;BlobItem&gt;&gt;</code>
**Kind**: instance method of [<code>BlobStorage</code>](#BlobStorage)
**Returns**: <code>Promise.&lt;Array.&lt;BlobItem&gt;&gt;</code> - - An array of BlobItem objects

| Param          | Type                | Description                        |
| -------------- | ------------------- | ---------------------------------- |
| containerName  | <code>string</code> | The name of the container to check |
| blobNamePrefix | <code>string</code> | The prefix of the blob name        |


#### blobStorage.downloadBlob(containerName, blobName) ⇒ <code>Promise.&lt;Buffer&gt;</code>
**Kind**: instance method of [<code>BlobStorage</code>](#BlobStorage)
**Returns**: <code>Promise.&lt;Buffer&gt;</code> - - A Buffer object

| Param         | Type                | Description                                |
| ------------- | ------------------- | ------------------------------------------ |
| containerName | <code>string</code> | The name of the container to download from |
| blobName      | <code>string</code> | The name of the blob to download           |


#### blobStorage.blobExists(containerName, blobName) ⇒ <code>Promise.&lt;boolean&gt;</code>
**Kind**: instance method of [<code>BlobStorage</code>](#BlobStorage)
**Returns**: <code>Promise.&lt;boolean&gt;</code> - - A boolean indicating whether or not the blob exists

| Param         | Type                | Description                        |
| ------------- | ------------------- | ---------------------------------- |
| containerName | <code>string</code> | The name of the container to check |
| blobName      | <code>string</code> | The name of the blob to check      |


#### blobStorage.upload(containerName, blobName, body, contentLength, contentType) ⇒ <code>Promise.&lt;boolean&gt;</code>
**Kind**: instance method of [<code>BlobStorage</code>](#BlobStorage)
**Returns**: <code>Promise.&lt;boolean&gt;</code> - - A boolean indicating whether or not the blob was successfully uploaded

| Param         | Type                         | Description                            |
| ------------- | ---------------------------- | -------------------------------------- |
| containerName | <code>string</code>          | The name of the container to upload to |
| blobName      | <code>string</code>          | The name of the blob to upload         |
| body          | <code>HttpRequestBody</code> | The body of the blob                   |
| contentLength | <code>string</code>          | The content length                     |
| contentType   | <code>string</code>          | The content type of the blob           |


#### blobStorage.uploadData(containerName, blobName, data, bufferSize) ⇒ <code>Promise.&lt;boolean&gt;</code>
**Kind**: instance method of [<code>BlobStorage</code>](#BlobStorage)
**Returns**: <code>Promise.&lt;boolean&gt;</code> - - A boolean indicating whether or not the blob was successfully uploaded

| Param         | Type                | Description                                                                                          |
| ------------- | ------------------- | ---------------------------------------------------------------------------------------------------- |
| containerName | <code>string</code> | The name of the container to upload to                                                               |
| blobName      | <code>string</code> | The name of the blob to upload                                                                       |
| data          |                     | Buffer                                                                                               | 
| bufferSize    |                     | Size of every buffer allocated, also the block size in the uploaded block blob. Default value is 8MB |


#### blobStorage.uploadStream(containerName, blobName, stream, bufferSize) ⇒ <code>Promise.&lt;boolean&gt;</code>
**Kind**: instance method of [<code>BlobStorage</code>](#BlobStorage)
**Returns**: <code>Promise.&lt;boolean&gt;</code> - - A boolean indicating whether or not the blob was successfully uploaded

| Param         | Type                | Description                                                                                          |
| ------------- | ------------------- | ---------------------------------------------------------------------------------------------------- |
| containerName | <code>string</code> | The name of the container to upload to                                                               |
| blobName      | <code>string</code> | The name of the blob to upload                                                                       |
| stream        |                     | Node.js Readable stream                                                                              |
| bufferSize    |                     | Size of every buffer allocated, also the block size in the uploaded block blob. Default value is 8MB |


#### blobStorage.generateSASUrl(containerName, blobName, sasOptions) ⇒ <code>string</code>
**Kind**: instance method of [<code>BlobStorage</code>](#BlobStorage)
**Returns**: <code>string</code> - -The URL for the blob.

| Param         | Type                    | Description                                    |
| ------------- | ----------------------- | ---------------------------------------------- |
| containerName | <code>string</code>     | The name of the blob container.                |
| blobName      | <code>string</code>     | The name of the blob.                          |
| sasOptions    | <code>SASOptions</code> | The options used for generating the SAS query. |


## License
[MIT](https://github.com/akadenia/AkadeniaAzure/blob/main/LICENSE)
