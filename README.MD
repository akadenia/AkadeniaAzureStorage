
## Classes

<dl>
<dt><a href="#QueueStorage">QueueStorage</a></dt>
<dd><p>QueueStorage - A class that contains azure queue storage helpers</p>
</dd>
<dt><a href="#BlobStorage">BlobStorage</a></dt>
<dd><p>BlobStorage - A class that contains azure blob storage helpers</p>
</dd>
</dl>

<a name="QueueStorage"></a>

## QueueStorage
QueueStorage - A class that contains azure queue storage helpers

**Kind**: global class

* [QueueStorage](#QueueStorage)
    * [.getQueueClient()](#QueueStorage+getQueueClient) ⇒ <code>QueueClient</code>
    * [.sendMessage(message)](#QueueStorage+sendMessage) ⇒ <code>Promise.&lt;any&gt;</code>

<a name="QueueStorage+getQueueClient"></a>

### queueStorage.getQueueClient() ⇒ <code>QueueClient</code>
**Kind**: instance method of [<code>QueueStorage</code>](#QueueStorage)
**Returns**: <code>QueueClient</code> - - A QueueClient object
<a name="QueueStorage+sendMessage"></a>

### queueStorage.sendMessage(message) ⇒ <code>Promise.&lt;any&gt;</code>
**Kind**: instance method of [<code>QueueStorage</code>](#QueueStorage)
**Returns**: <code>Promise.&lt;any&gt;</code> - - The response from the queue

| Param | Type | Description |
| --- | --- | --- |
| message | <code>string</code> | The message to send |

<a name="BlobStorage"></a>

## BlobStorage
BlobStorage - A class that contains azure blob storage helpers

**Kind**: global class

* [BlobStorage](#BlobStorage)
    * [.getBlobServiceUrl()](#BlobStorage+getBlobServiceUrl) ⇒ <code>BlobServiceClient</code>
    * [.listBlobs(containerName, blobNamePrefix)](#BlobStorage+listBlobs) ⇒ <code>Promise.&lt;Array.&lt;BlobItem&gt;&gt;</code>
    * [.downloadBlob(containerName, blobName)](#BlobStorage+downloadBlob) ⇒ <code>Promise.&lt;Buffer&gt;</code>
    * [.blobExists(containerName, blobName)](#BlobStorage+blobExists) ⇒ <code>Promise.&lt;boolean&gt;</code>
    * [.upload(containerName, blobName, body, contentLength, contentType)](#BlobStorage+upload) ⇒ <code>Promise.&lt;boolean&gt;</code>
    * [.uploadData(containerName, blobName, data, bufferSize)](#BlobStorage+uploadData) ⇒ <code>Promise.&lt;boolean&gt;</code>
    * [.uploadStream(containerName, blobName, stream, bufferSize)](#BlobStorage+uploadStream) ⇒ <code>Promise.&lt;boolean&gt;</code>
    * [.generateSASUrl(containerName, blobName, sasOptions)](#BlobStorage+generateSASUrl) ⇒ <code>string</code>

<a name="BlobStorage+getBlobServiceUrl"></a>

### blobStorage.getBlobServiceUrl() ⇒ <code>BlobServiceClient</code>
**Kind**: instance method of [<code>BlobStorage</code>](#BlobStorage)
**Returns**: <code>BlobServiceClient</code> - - A BlobServiceClient object
<a name="BlobStorage+listBlobs"></a>

### blobStorage.listBlobs(containerName, blobNamePrefix) ⇒ <code>Promise.&lt;Array.&lt;BlobItem&gt;&gt;</code>
**Kind**: instance method of [<code>BlobStorage</code>](#BlobStorage)
**Returns**: <code>Promise.&lt;Array.&lt;BlobItem&gt;&gt;</code> - - An array of BlobItem objects

| Param | Type | Description |
| --- | --- | --- |
| containerName | <code>string</code> | The name of the container to check |
| blobNamePrefix | <code>string</code> | The prefix of the blob name |

<a name="BlobStorage+downloadBlob"></a>

### blobStorage.downloadBlob(containerName, blobName) ⇒ <code>Promise.&lt;Buffer&gt;</code>
**Kind**: instance method of [<code>BlobStorage</code>](#BlobStorage)
**Returns**: <code>Promise.&lt;Buffer&gt;</code> - - A Buffer object

| Param | Type | Description |
| --- | --- | --- |
| containerName | <code>string</code> | The name of the container to download from |
| blobName | <code>string</code> | The name of the blob to download |

<a name="BlobStorage+blobExists"></a>

### blobStorage.blobExists(containerName, blobName) ⇒ <code>Promise.&lt;boolean&gt;</code>
**Kind**: instance method of [<code>BlobStorage</code>](#BlobStorage)
**Returns**: <code>Promise.&lt;boolean&gt;</code> - - A boolean indicating whether or not the blob exists

| Param | Type | Description |
| --- | --- | --- |
| containerName | <code>string</code> | The name of the container to check |
| blobName | <code>string</code> | The name of the blob to check |

<a name="BlobStorage+upload"></a>

### blobStorage.upload(containerName, blobName, body, contentLength, contentType) ⇒ <code>Promise.&lt;boolean&gt;</code>
**Kind**: instance method of [<code>BlobStorage</code>](#BlobStorage)
**Returns**: <code>Promise.&lt;boolean&gt;</code> - - A boolean indicating whether or not the blob was successfully uploaded

| Param | Type | Description |
| --- | --- | --- |
| containerName | <code>string</code> | The name of the container to upload to |
| blobName | <code>string</code> | The name of the blob to upload |
| body | <code>HttpRequestBody</code> | The body of the blob |
| contentLength | <code>string</code> | The content length |
| contentType | <code>string</code> | The content type of the blob |

<a name="BlobStorage+uploadData"></a>

### blobStorage.uploadData(containerName, blobName, data, bufferSize) ⇒ <code>Promise.&lt;boolean&gt;</code>
**Kind**: instance method of [<code>BlobStorage</code>](#BlobStorage)
**Returns**: <code>Promise.&lt;boolean&gt;</code> - - A boolean indicating whether or not the blob was successfully uploaded

| Param | Type | Description |
| --- | --- | --- |
| containerName | <code>string</code> | The name of the container to upload to |
| blobName | <code>string</code> | The name of the blob to upload |
| data |  | Buffer | Blob | ArrayBuffer | ArrayBufferView |
| bufferSize |  | Size of every buffer allocated, also the block size in the uploaded block blob. Default value is 8MB |

<a name="BlobStorage+uploadStream"></a>

### blobStorage.uploadStream(containerName, blobName, stream, bufferSize) ⇒ <code>Promise.&lt;boolean&gt;</code>
**Kind**: instance method of [<code>BlobStorage</code>](#BlobStorage)
**Returns**: <code>Promise.&lt;boolean&gt;</code> - - A boolean indicating whether or not the blob was successfully uploaded

| Param | Type | Description |
| --- | --- | --- |
| containerName | <code>string</code> | The name of the container to upload to |
| blobName | <code>string</code> | The name of the blob to upload |
| stream |  | Node.js Readable stream |
| bufferSize |  | Size of every buffer allocated, also the block size in the uploaded block blob. Default value is 8MB |

<a name="BlobStorage+generateSASUrl"></a>

### blobStorage.generateSASUrl(containerName, blobName, sasOptions) ⇒ <code>string</code>
**Kind**: instance method of [<code>BlobStorage</code>](#BlobStorage)
**Returns**: <code>string</code> - -The URL for the blob.

| Param | Type | Description |
| --- | --- | --- |
| containerName | <code>string</code> | The name of the blob container. |
| blobName | <code>string</code> | The name of the blob. |
| sasOptions | <code>SASOptions</code> | The options used for generating the SAS query. |