import { afterEach, beforeEach, describe, expect, it, jest } from "@jest/globals"

import { BlobStorage, BlobPermissions, SASOptions } from "../src/blob"
import exp from "constants"

const storageConnectionString =
  "DefaultEndpointsProtocol=http;AccountName=devstoreaccount1;AccountKey=Eby8vdM02xNOcqFlqUwJPLlmEtlCDXJ1OUzFT50uSRZ6IFsuFq2UVErCz4I6tq/K1SZFPTOtr/KBHBeksoGMGw==;BlobEndpoint=http://127.0.0.1:10000/devstoreaccount1;QueueEndpoint=http://127.0.0.1:10001/devstoreaccount1;TableEndpoint=http://127.0.0.1:10002/devstoreaccount1;"

describe("BlobStorage", () => {
  const blob = new BlobStorage(storageConnectionString)
  const containerName = "testcontainer"
  const blobPath = "path/testblob.txt"

  beforeEach(async () => {
    const containerCreated = await blob.createContainer(containerName)
    expect(containerCreated).toBe(true)
  })

  afterEach(async () => {
    await blob.deleteContainer(containerName)
  })

  it("should get a BlobServiceClient object", () => {
    const blobServiceClient = blob.getBlobServiceUrl()

    expect(blobServiceClient).toBeDefined()
  })

  it("should list blobs", async () => {
    const result = await blob.listBlobs(containerName, "testblob")
    expect(result).toEqual([])
  })

  it("should check if a blob exists", async () => {
    const result = await blob.blobExists(containerName, "testblob")
    expect(result).toBe(false)
  })

  it("should generate a valid SAS URL", async () => {
    const sasOptions: SASOptions = {
      startsOn: new Date(),
      expires: 3600,
      permissions: [BlobPermissions.WRITE],
    }
    const sasUrl = blob.generateSASUrl(containerName, blobPath, sasOptions)
    expect(sasUrl.split("?")?.[0]).toEqual(`http://127.0.0.1:10000/devstoreaccount1/${containerName}`)
  })

  it("should upload data using SAS URL", async () => {
    const sasOptions: SASOptions = {
      startsOn: new Date(),
      expires: 3600,
      permissions: [BlobPermissions.WRITE],
    }
    const sasUrl = blob.generateSASUrl(containerName, blobPath, sasOptions)

    const newBlob = new BlobStorage(sasUrl)

    await newBlob.uploadData("", blobPath, Buffer.from("test data"), sasUrl)

    const blobExists = await blob.blobExists(containerName, blobPath)
    expect(blobExists).toBe(true)
  })

  it("should upload data using SAS URL and set the content type", async () => {
    const sasOptions: SASOptions = {
      startsOn: new Date(),
      expires: 3600,
      permissions: [BlobPermissions.WRITE],
    }
    const sasUrl = blob.generateSASUrl(containerName, blobPath, sasOptions)

    const newBlob = new BlobStorage(sasUrl)

    await newBlob.uploadData("", blobPath, Buffer.from("test data"), sasUrl, {
      blobContentType: "text/plain",
    })

    const blobExists = await blob.blobExists(containerName, blobPath)
    expect(blobExists).toBe(true)

    // Check the content type of the blob
    const currentBlob = blob.getBlobServiceUrl().getContainerClient(containerName).getBlockBlobClient(blobPath)
    const blobProperties = await currentBlob.getProperties()
    expect(blobProperties.blobType).toBe("BlockBlob")
    expect(blobProperties.contentType).toBe("text/plain")
  })
})
