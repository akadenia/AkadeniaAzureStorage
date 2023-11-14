
## Getting Started

Import the Storage class.

`import { BlobStorage } from "@akadenia/azure`

Create an instance by passing a connection string.
``
`const storage = new BlobStorage("your-connection-string")`

Access the available methods on your instance.

## `storage.blobExists(containerName, blobName)`

Returns a boolean value that indicates whether or not a blob exists.

Arguments
|Name|Type|Required|Description|
|--|--|--|--|
|`containerName`|`string`|`true`|The container to check for the blob|
|`blobName`|`string` |`true`|The name of the blob to check for|

## `storage.getBlobServiceUrl()`

Returns a blob service client object with Azure `BlobServiceClient` methods available.

Arguments
|Name|Type|Required|Description|
|--|--|--|--|

## `storage.listBlobs(containerName, blobNamePrefix)`

Returns an array of `BlobItem` objects.

Arguments
|Name|Type|Required|Description|
|--|--|--|--|
|`containerName`|`string`|`true`|The container to check for the blob|
|`blobNamePrefix`|`string` |`true`|The blob name prefixes to check for a match|

## `storage.downloadBlob(containerName, blobName)`

Returns a `Buffer` object.

Arguments
|Name|Type|Required|Description|
|--|--|--|--|
|`containerName`|`string`|`true`|The container to check for the blob|
|`blobName`|`string` |`true`|The name of the blob to download|

## `storage.upload(containerName, blobName, body, type)`

Returns a `boolean` indicating whether or not the blob was successfully uploaded.

Arguments
|Name|Type|Required|Description|
|--|--|--|--|
|`containerName`|`string`|`true`|The container to upload the blob to|
|`blobName`|`string` |`true`|The name of the blob to upload|
|`body`|`string` or `ArrayBuffer` |`true`|The body of the blob being uploaded|
|`type`|`string` |`true`|The type of the blob|