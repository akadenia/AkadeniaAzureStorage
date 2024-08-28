import {
  BlobItem,
  BlobSASPermissions,
  BlobServiceClient,
  BlobUploadCommonResponse,
  BlockBlobUploadResponse,
  generateBlobSASQueryParameters,
  HttpRequestBody,
  StorageSharedKeyCredential,
} from "@azure/storage-blob"
import { setLogLevel } from "@azure/logger"
import { Readable } from "stream"

setLogLevel("error")

export enum BlobPermissions {
  READ = "r",
  WRITE = "w",
  CREATE = "c",
  DELETE = "d",
  ADD = "a",
}

export interface SASOptions {
  startsOn?: Date
  expires?: number
  permissions?: BlobPermissions[]
}

/**
 * @class BlobStorage - A class that contains azure blob storage helpers
 */
export class BlobStorage {
  private connectionString: string

  constructor(connectionString: string) {
    this.connectionString = connectionString
  }

  /**
   * @returns {BlobServiceClient} - A BlobServiceClient object
   */
  getBlobServiceUrl(): BlobServiceClient {
    return BlobServiceClient.fromConnectionString(this.connectionString)
  }

  /**
   * @param {string} containerName - The name of the container to check
   * @param {string} blobNamePrefix - The prefix of the blob name
   * @returns {Promise<Array<BlobItem>>} - An array of BlobItem objects
   */
  async listBlobs(containerName: string, blobNamePrefix: string) {
    const blobService = this.getBlobServiceUrl()
    const container = blobService.getContainerClient(containerName)
    const result: BlobItem[] = []
    for await (const blob of container.listBlobsFlat({ prefix: blobNamePrefix })) {
      result.push(blob)
    }

    return result
  }

  /**
   * @param {string} containerName - The name of the container to download from
   * @param {string} blobName - The name of the blob to download
   * @returns {Promise<Buffer>} - A Buffer object
   */
  async downloadBlob(containerName: string, blobName: string): Promise<Buffer> {
    const blobService = this.getBlobServiceUrl()
    const container = blobService.getContainerClient(containerName)
    const blob = container.getBlobClient(blobName)

    return await blob.downloadToBuffer()
  }

  /**
   * @param {string} containerName - The name of the container to check
   * @param {string} blobName - The name of the blob to check
   * @returns {Promise<boolean>} - A boolean indicating whether or not the blob exists
   */
  async blobExists(containerName: string, blobName: string): Promise<boolean> {
    const blobService = this.getBlobServiceUrl()
    const container = blobService.getContainerClient(containerName)
    const blob = container.getBlockBlobClient(blobName)

    return await blob.exists()
  }

  /**
   * @param {string} containerName - The name of the container to upload to
   * @param {string} blobName - The name of the blob to upload
   * @param {HttpRequestBody} body - The body of the blob
   * @param {string} contentLength - The content length
   * @param {string} contentType - The content type of the blob
   * @returns {Promise<boolean>} - A boolean indicating whether or not the blob was successfully uploaded
   */
  async upload(
    containerName: string,
    blobName: string,
    body: HttpRequestBody,
    contentLength: number,
    contentType: string,
  ): Promise<boolean> {
    const blobService = this.getBlobServiceUrl()
    const container = blobService.getContainerClient(containerName)
    const blob = container.getBlockBlobClient(blobName)

    const response: BlockBlobUploadResponse = await blob.upload(body, contentLength, {
      blobHTTPHeaders: { blobContentType: contentType },
    })

    return response.errorCode === undefined
  }

  /**
   * @param {string} containerName - The name of the container to upload to
   * @param {string} blobName - The name of the blob to upload
   * @param data -  Buffer | Blob | ArrayBuffer | ArrayBufferView
   * @param bufferSize - Size of every buffer allocated, also the block size in the uploaded block blob. Default value is 8MB
   * @returns {Promise<boolean>} - A boolean indicating whether or not the blob was successfully uploaded
   */
  async uploadData(
    containerName: string,
    blobName: string,
    data: Buffer | Blob | ArrayBuffer | ArrayBufferView,
  ): Promise<boolean> {
    const blobService = this.getBlobServiceUrl()
    const container = blobService.getContainerClient(containerName)
    const blob = container.getBlockBlobClient(blobName)

    const response: BlobUploadCommonResponse = await blob.uploadData(data)

    return response.errorCode === undefined
  }

  /**
   * @param {string} containerName - The name of the container to upload to
   * @param {string} blobName - The name of the blob to upload
   * @param stream - Node.js Readable stream
   * @param bufferSize - Size of every buffer allocated, also the block size in the uploaded block blob. Default value is 8MB
   * @returns {Promise<boolean>} - A boolean indicating whether or not the blob was successfully uploaded
   */
  async uploadStream(containerName: string, blobName: string, stream: Readable): Promise<boolean> {
    const blobService = this.getBlobServiceUrl()
    const container = blobService.getContainerClient(containerName)
    const blob = container.getBlockBlobClient(blobName)

    const response: BlobUploadCommonResponse = await blob.uploadStream(stream)

    return response.errorCode === undefined
  }

  /**
   * @param {string} containerName - The name of the blob container.
   * @param {string} blobName - The name of the blob.
   * @param {SASOptions} sasOptions - The options used for generating the SAS query.
   * @returns {string} -The URL for the blob.
   */
  generateSASUrl(containerName: string, blobName: string, sasOptions: SASOptions = {}): string {
    const blobService = this.getBlobServiceUrl()
    const container = blobService.getContainerClient(containerName)

    const { startsOn = new Date(), expires = 3600, permissions = [BlobPermissions.READ] } = sasOptions

    const options = {
      containerName,
      blobName,
      startsOn,
      expiresOn: new Date(Date.now() + expires * 1000),
      permissions: BlobSASPermissions.parse(permissions.join("")),
    }

    const accountName = this.connectionString.match(/AccountName=(.+?);/)?.[1]
    const accountKey = this.connectionString.match(/AccountKey=(.+?);/)?.[1]

    if (!(accountName && accountKey)) {
      throw new Error("Could not extract account name and account key from connection string")
    }

    const sharedKeyCredential = new StorageSharedKeyCredential(accountName, accountKey)
    const sasToken = generateBlobSASQueryParameters(options, sharedKeyCredential).toString()

    return `${container.getBlockBlobClient(blobName).url}?${sasToken}`
  }
}
