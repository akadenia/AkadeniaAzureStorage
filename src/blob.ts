import {
  BlobHTTPHeaders,
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
  expiresOn?: Date
  permissions?: BlobPermissions[]
}

/**
 * @class BlobStorage - A class that contains azure blob storage helpers
 */
export class BlobStorage {
  private connectionStringOrSASUrl: string

  constructor(connectionStringOrSASUrl: string) {
    if (!connectionStringOrSASUrl) {
      throw new Error("Connection string or SAS URL is required")
    }
    this.connectionStringOrSASUrl = connectionStringOrSASUrl
  }

  isEmulatorConnection() {
    return (
      this.connectionStringOrSASUrl.includes("UseDevelopmentStorage=true") ||
      this.connectionStringOrSASUrl.includes("devstoreaccount1")
    )
  }

  isSASUrl() {
    return this.connectionStringOrSASUrl.includes("?sv=") && this.connectionStringOrSASUrl.includes("sig=")
  }

  /**
   * @returns {BlobServiceClient} - A BlobServiceClient object
   */
  getBlobServiceUrl(): BlobServiceClient {
    if (this.isSASUrl()) {
      return new BlobServiceClient(this.connectionStringOrSASUrl)
    }

    return BlobServiceClient.fromConnectionString(this.connectionStringOrSASUrl)
  }

  /**
   * Creates a container in Azure Blob Storage if it does not already exist.
   *
   * @param containerName - The name of the container to create.
   * @param sasUrl - Optional. The SAS URL for accessing the Blob service. If not provided, the default Blob service URL will be used.
   * @returns A promise that resolves to a boolean indicating whether the container was successfully created or already exists.
   */
  async createContainer(containerName: string): Promise<boolean> {
    const blobService = this.getBlobServiceUrl()
    const container = blobService.getContainerClient(containerName)

    const result = await container.createIfNotExists()
    return result.succeeded
  }

  /**
   * Deletes a container in Azure Blob Storage if it exists.
   *
   * @param containerName - The name of the container to delete.
   * @returns A promise that resolves to a boolean indicating whether the container was successfully deleted.
   */
  async deleteContainer(containerName: string): Promise<boolean> {
    const blobService = this.getBlobServiceUrl()
    const container = blobService.getContainerClient(containerName)

    const result = await container.deleteIfExists()

    return result.succeeded
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
   * @param {BlobHTTPHeaders} [blobHTTPHeaders] - The blob HTTP headers to set while uploading the blob
   * @param bufferSize - Size of every buffer allocated, also the block size in the uploaded block blob. Default value is 8MB
   * @returns {Promise<boolean>} - A boolean indicating whether or not the blob was successfully uploaded
   */
  async uploadData(
    containerName: string,
    blobName: string,
    data: Buffer | Blob | ArrayBuffer | ArrayBufferView,
    blobHTTPHeaders?: BlobHTTPHeaders,
  ): Promise<boolean> {
    const blobService = this.getBlobServiceUrl()
    const container = blobService.getContainerClient(containerName)
    const blob = container.getBlockBlobClient(blobName)

    const response = await blob.uploadData(data, {
      blobHTTPHeaders,
    })

    return response.errorCode === undefined
  }

  /**
   * @param {string} containerName - The name of the container to upload to
   * @param {string} blobName - The name of the blob to upload
   * @param stream - Node.js Readable stream
   * @param {BlobHTTPHeaders} [blobHTTPHeaders] - The blob HTTP headers to set while uploading the blob
   * @param bufferSize - Size of every buffer allocated, also the block size in the uploaded block blob. Default value is 8MB
   * @returns {Promise<boolean>} - A boolean indicating whether or not the blob was successfully uploaded
   */
  async uploadStream(
    containerName: string,
    blobName: string,
    stream: Readable,
    blobHTTPHeaders?: BlobHTTPHeaders,
  ): Promise<boolean> {
    const blobService = this.getBlobServiceUrl()
    const container = blobService.getContainerClient(containerName)
    const blob = container.getBlockBlobClient(blobName)

    const response: BlobUploadCommonResponse = await blob.uploadStream(stream, undefined, undefined, {
      blobHTTPHeaders,
    })

    return response.errorCode === undefined
  }

  /**
   * @param {string} containerName - The name of the blob container.
   * @param {string} blobName - The name of the blob.
   * @param {SASOptions} sasOptions - The options used for generating the SAS query.
   * @returns {string} - The storage account url with SAS token as query parameters
   */
  generateSASUrl(containerName: string, blobName?: string, sasOptions: SASOptions = {}): string {
    const blobService = this.getBlobServiceUrl()

    const {
      startsOn = new Date(new Date().valueOf() - 300 * 1000),
      expiresOn = new Date(new Date().valueOf() + 3600 * 1000),
      permissions = [BlobPermissions.READ],
    } = sasOptions

    const options = {
      containerName,
      blobName,
      startsOn,
      expiresOn,
      permissions: BlobSASPermissions.parse(permissions.join("")),
    }

    const parts = this.connectionStringOrSASUrl.split(";")
    const accountName = parts.find((p) => p.startsWith("AccountName="))?.split("=")[1]
    const accountKey = parts.find((p) => p.startsWith("AccountKey="))?.split("=")[1]

    if (!(accountName && accountKey)) {
      throw new Error("Could not extract account name and account key from connection string")
    }

    const sharedKeyCredential = new StorageSharedKeyCredential(accountName, accountKey)
    const sasToken = generateBlobSASQueryParameters(options, sharedKeyCredential).toString()

    return `${blobService.url}?${sasToken}`
  }

  /**
   * Deletes a blob from the specified container.
   *
   * @param {string} containerName - The name of the container containing the blob
   * @param {string} blobName - The name of the blob to delete
   * @returns {Promise<boolean>} - A boolean indicating whether the blob was successfully deleted
   */
  async deleteBlob(containerName: string, blobName: string): Promise<boolean> {
    const blobService = this.getBlobServiceUrl()
    const container = blobService.getContainerClient(containerName)
    const blob = container.getBlockBlobClient(blobName)

    try {
      const response = await blob.delete()
      return response.errorCode === undefined
    } catch (error: any) {
      if (error.statusCode === 404) {
        if (!this.isSASUrl()) {
          return true
        }
        throw error
      }
      throw error
    }
  }
}
