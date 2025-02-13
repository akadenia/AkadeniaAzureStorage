import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it, jest } from "@jest/globals"

import { BlobStorage, BlobPermissions, SASOptions } from "../src/blob"

describe("BlobStorage", () => {
  const storageConnectionString =
    "DefaultEndpointsProtocol=http;AccountName=devstoreaccount1;AccountKey=Eby8vdM02xNOcqFlqUwJPLlmEtlCDXJ1OUzFT50uSRZ6IFsuFq2UVErCz4I6tq/K1SZFPTOtr/KBHBeksoGMGw==;BlobEndpoint=http://127.0.0.1:10000/devstoreaccount1;QueueEndpoint=http://127.0.0.1:10001/devstoreaccount1;TableEndpoint=http://127.0.0.1:10002/devstoreaccount1;"

  const blobClient = new BlobStorage(storageConnectionString)

  const containerName = `testcontainer-${Math.random().toString(36).substring(2, 15)}`
  let blobName = "path/testblob.txt"

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

    const sasUrlComponents = blobClient.generateSASUrl(containerName, "", sasOptions)
    expect(sasUrlComponents.fullUrl).toBeDefined()
    expect(sasUrlComponents.sasQueryString).toContain("sp=w")
    expect(sasUrlComponents.sasQueryString).toContain("sig=")
    expect(sasUrlComponents.sasQueryString).toContain("se=")
    expect(sasUrlComponents.sasQueryString).toContain("st=")
    expect(sasUrlComponents.sasQueryString).toContain("sr=")
  })

  it("should upload data using SAS URL", async () => {
    const sasOptions: SASOptions = {
      permissions: [BlobPermissions.WRITE],
    }

    const sasUrlComponents = blobClient.generateSASUrl(containerName, blobName, sasOptions)
    const newBlobClient = new BlobStorage(sasUrlComponents.fullUrl)

    await newBlobClient.uploadData(containerName, blobName, Buffer.from("test data"))

    const blobExists = await blobClient.blobExists(containerName, blobName)
    expect(blobExists).toBe(true)
  })

  it("should fail on invalid permissions", async () => {
    const sasOptions: SASOptions = {
      permissions: [BlobPermissions.READ],
    }
    const sasUrlComponents = blobClient.generateSASUrl(containerName, blobName, sasOptions)
    const newBlobClient = new BlobStorage(sasUrlComponents.fullUrl)
    await expect(newBlobClient.uploadData(containerName, blobName, Buffer.from("test data"))).rejects.toThrow()
  })

  it("should succeed on upload blob to a container with correct sas permissions", async () => {
    const sasOptions: SASOptions = {
      startsOn: new Date(),
      expiresOn: new Date(new Date().valueOf() + 3600 * 1000),
      permissions: [BlobPermissions.ADD, BlobPermissions.WRITE],
    }
    const sasUrlComponents = blobClient.generateSASUrl(containerName, undefined, sasOptions)
    const newBlobClient = new BlobStorage(sasUrlComponents.fullUrl)

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

  it("should fail on adding a blob to a container with sas permissions under a different blob name", async () => {
    const sasOptions: SASOptions = {
      permissions: [BlobPermissions.ADD, BlobPermissions.WRITE],
    }
    const sasUrlComponents = blobClient.generateSASUrl(containerName, "specificblobname.txt", sasOptions)
    const newBlobClient = new BlobStorage(sasUrlComponents.fullUrl)
    await expect(newBlobClient.uploadData(containerName, "differentblobname.txt", Buffer.from("test data"))).rejects.toThrow()
  })

  it("should succeed on adding a blob to a container with sas permissions under a same blob name", async () => {
    const sasOptions: SASOptions = {
      permissions: [BlobPermissions.ADD, BlobPermissions.WRITE],
    }
    const sasUrlComponents = blobClient.generateSASUrl(containerName, "specificblobname.txt", sasOptions)
    const newBlobClient = new BlobStorage(sasUrlComponents.fullUrl)
    await expect(newBlobClient.uploadData(containerName, "specificblobname.txt", Buffer.from("test data"))).resolves.toBe(true)
  })

  it("should generate a valid SAS URL with read-only access", async () => {
    blobName = "path/sasReadBlob.txt"

    await blobClient.uploadData(containerName, blobName, Buffer.from("readable test data"))

    const sasOptions: SASOptions = {
      startsOn: new Date(),
      expiresOn: new Date(new Date().valueOf() + 3600 * 1000),
      permissions: [BlobPermissions.READ],
    }
    const sasUrlComponents = blobClient.generateSASUrl(containerName, blobName, sasOptions)

    const newBlobClient = new BlobStorage(sasUrlComponents.fullUrl)
    const data = await newBlobClient.downloadBlob(containerName, blobName)

    expect(data).toEqual(Buffer.from("readable test data"))
  })

  it("should upload a text file to a container then be able to retrieve it via fetch with sas url", async () => {
    const sasOptions: SASOptions = {
      permissions: [BlobPermissions.READ],
    }
    await blobClient.uploadData(containerName, blobName, Buffer.from("readable test data"))

    const sasUrlComponents = blobClient.generateSASUrl(containerName, blobName, sasOptions)

    const urlParts = sasUrlComponents.fullUrl.split("?")
    const baseUrl = urlParts[0]
    const queryString = urlParts[1]

    const response = await fetch(`${baseUrl}/${containerName}/${blobName}?${queryString}`)

    const text = await response.text()
    expect(response.status).toBe(200)
    expect(text).toBe("readable test data")
  })

  describe("deleteBlob", () => {
    it("should delete an existing blob", async () => {
      // First upload a blob
      const testBlobName = "delete-test-blob.txt"
      await blobClient.uploadData(containerName, testBlobName, Buffer.from("test data"))

      // Verify blob exists
      let exists = await blobClient.blobExists(containerName, testBlobName)
      expect(exists).toBe(true)

      // Delete the blob
      const deleteResult = await blobClient.deleteBlob(containerName, testBlobName)
      expect(deleteResult).toBe(true)

      // Verify blob no longer exists
      exists = await blobClient.blobExists(containerName, testBlobName)
      expect(exists).toBe(false)
    })

    it("should return true when attempting to delete a non-existent blob with connection string", async () => {
      const nonExistentBlobName = "non-existent-blob.txt"

      // Verify blob doesn't exist
      const exists = await blobClient.blobExists(containerName, nonExistentBlobName)
      expect(exists).toBe(false)

      // Attempt to delete non-existent blob
      const deleteResult = await blobClient.deleteBlob(containerName, nonExistentBlobName)
      expect(deleteResult).toBe(true)
    })

    it("should fail when attempting to delete a non-existent blob with SAS URL", async () => {
      const nonExistentBlobName = "non-existent-blob.txt"

      const sasOptions: SASOptions = {
        permissions: [BlobPermissions.DELETE, BlobPermissions.READ, BlobPermissions.WRITE],
      }
      const sasUrlComponents = blobClient.generateSASUrl(containerName, nonExistentBlobName, sasOptions)
      const sasClient = new BlobStorage(sasUrlComponents.fullUrl)

      // Attempt to delete non-existent blob should throw
      await expect(sasClient.deleteBlob(containerName, nonExistentBlobName)).rejects.toThrow()
    })

    it("should delete blob with SAS URL having delete permission", async () => {
      // First upload a blob
      const testBlobName = "sas-delete-test-blob.txt"
      await blobClient.uploadData(containerName, testBlobName, Buffer.from("test data"))

      // Create SAS URL with delete permission
      const sasOptions: SASOptions = {
        permissions: [BlobPermissions.DELETE, BlobPermissions.READ, BlobPermissions.WRITE],
      }
      const sasUrlComponents = blobClient.generateSASUrl(containerName, testBlobName, sasOptions)
      const sasClient = new BlobStorage(sasUrlComponents.fullUrl)

      // Delete using SAS client
      const deleteResult = await sasClient.deleteBlob(containerName, testBlobName)
      expect(deleteResult).toBe(true)

      // Verify blob no longer exists
      const exists = await blobClient.blobExists(containerName, testBlobName)
      expect(exists).toBe(false)
    })
  })
})
