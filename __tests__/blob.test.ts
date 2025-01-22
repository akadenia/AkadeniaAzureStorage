import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it, jest } from "@jest/globals"

import { BlobStorage, BlobPermissions, SASOptions } from "../src/blob"

describe("BlobStorage", () => {
  const storageConnectionString =
    "DefaultEndpointsProtocol=http;AccountName=devstoreaccount1;AccountKey=Eby8vdM02xNOcqFlqUwJPLlmEtlCDXJ1OUzFT50uSRZ6IFsuFq2UVErCz4I6tq/K1SZFPTOtr/KBHBeksoGMGw==;BlobEndpoint=http://127.0.0.1:10000/devstoreaccount1;QueueEndpoint=http://127.0.0.1:10001/devstoreaccount1;TableEndpoint=http://127.0.0.1:10002/devstoreaccount1;"

  const blobClient = new BlobStorage(storageConnectionString)
  const containerName = `testcontainer-${Math.random().toString(36).substring(2, 15)}`
  let blobName = "path/testblob.txt"
  const accountName = "projectagramstg"

  beforeAll(async () => {
    const containerCreated = await blobClient.createContainer(containerName)
    expect(containerCreated).toBe(true)
  })

  afterAll(async () => {
    await blobClient.deleteContainer(containerName)
  })

  it("should get a BlobServiceClient object", () => {
    const blobServiceClient = blobClient.getBlobServiceUrl()

    expect(blobServiceClient).toBeDefined()
  })

  it("should list blobs", async () => {
    const result = await blobClient.listBlobs(containerName, "testblob")
    expect(result).toEqual([])
  })

  it("should check if a blob exists", async () => {
    const result = await blobClient.blobExists(containerName, "testblob")
    expect(result).toBe(false)
  })

  it("should generate a valid SAS URL", async () => {
    const sasOptions: SASOptions = {
      startsOn: new Date(),
      expiresOn: new Date(new Date().valueOf() + 3600 * 1000),
      permissions: [BlobPermissions.WRITE],
    }

    const sasUrl = blobClient.generateSASUrl(containerName, "", sasOptions)
    expect(sasUrl.split("?")?.[0]).toEqual(blobClient.getBlobServiceUrl().url)
    expect(sasUrl).toContain("sp=w")
    expect(sasUrl).toContain("sig=")
    expect(sasUrl).toContain("se=")
    expect(sasUrl).toContain("st=")
    expect(sasUrl).toContain("sr=")
  })

  it("should upload data using SAS URL", async () => {
    const sasOptions: SASOptions = {
      permissions: [BlobPermissions.WRITE],
    }

    const sasUrl = blobClient.generateSASUrl(containerName, blobName, sasOptions)

    const newBlobClient = new BlobStorage(sasUrl)

    await newBlobClient.uploadData(containerName, blobName, Buffer.from("test data"))

    const blobExists = await blobClient.blobExists(containerName, blobName)
    expect(blobExists).toBe(true)
  })

  it("should upload data using SAS URL and set the content type", async () => {
    const sasOptions: SASOptions = {
      startsOn: new Date(),
      expiresOn: new Date(new Date().valueOf() + 3600 * 1000),
      permissions: [BlobPermissions.WRITE],
    }
    const sasUrl = blobClient.generateSASUrl(containerName, blobName, sasOptions)

    const newBlobClient = new BlobStorage(sasUrl)

    await newBlobClient.uploadData(containerName, blobName, Buffer.from("test data"), {
      blobContentType: "text/plain",
    })

    const blobExists = await blobClient.blobExists(containerName, blobName)
    expect(blobExists).toBe(true)

    // Check the content type of the blob
    const currentBlob = blobClient.getBlobServiceUrl().getContainerClient(containerName).getBlockBlobClient(blobName)
    const blobProperties = await currentBlob.getProperties()
    expect(blobProperties.blobType).toBe("BlockBlob")
    expect(blobProperties.contentType).toBe("text/plain")
  })

  it("should generate a valid SAS URL with read-only access", async () => {
    blobName = "path/sasReadBlob.txt"

    await blobClient.uploadData(containerName, blobName, Buffer.from("readable test data"))

    const sasOptions: SASOptions = {
      startsOn: new Date(),
      expiresOn: new Date(new Date().valueOf() + 3600 * 1000),
      permissions: [BlobPermissions.READ],
    }
    const sasUrl = blobClient.generateSASUrl(containerName, blobName, sasOptions)

    const newBlobClient = new BlobStorage(sasUrl)
    const data = await newBlobClient.downloadBlob(containerName, blobName)

    expect(data).toEqual(Buffer.from("readable test data"))
  })
})
