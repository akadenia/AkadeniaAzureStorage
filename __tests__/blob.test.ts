import { describe, expect, it, jest } from "@jest/globals"

import { BlobStorage, BlobPermissions, SASOptions } from "../src/blob"
import exp from "constants"

const storageConnectionString =
  "DefaultEndpointsProtocol=http;AccountName=devstoreaccount1;AccountKey=Eby8vdM02xNOcqFlqUwJPLlmEtlCDXJ1OUzFT50uSRZ6IFsuFq2UVErCz4I6tq/K1SZFPTOtr/KBHBeksoGMGw==;BlobEndpoint=http://127.0.0.1:10000/devstoreaccount1;QueueEndpoint=http://127.0.0.1:10001/devstoreaccount1;TableEndpoint=http://127.0.0.1:10002/devstoreaccount1;"

describe("BlobStorage", () => {
  it("should get a BlobServiceClient object", () => {
    const blob = new BlobStorage(storageConnectionString)
    const blobServiceClient = blob.getBlobServiceUrl()

    expect(blobServiceClient).toBeDefined()
  })

  it("should list blobs", async () => {
    const blob = new BlobStorage(storageConnectionString)
    await blob.createContainer("testcontainer")
    const result = await blob.listBlobs("testcontainer", "testblob")

    expect(result).toEqual([])
  })

  //   it("should download a blob", async () => {
  //     const blob = new BlobStorage(storageConnectionString)
  //     await blob.createContainer("testcontainer")

  //     const result = await blob.downloadBlob("testcontainer", "testblob")

  //     expect(result).toBeInstanceOf(Buffer)
  //   })

  it("should check if a blob exists", async () => {
    const blob = new BlobStorage(storageConnectionString)
    blob.createContainer("testcontainer")

    const result = await blob.blobExists("testcontainer", "testblob")

    expect(result).toBe(false)
  })


  it("should generate a SAS URL and be able to create a file with it", async () => {
    const blob = new BlobStorage(storageConnectionString)
    blob.createContainer("testcontainer")

    const sasOptions: SASOptions = {
      startsOn: new Date(),
      expires: 3600,
      permissions: [BlobPermissions.WRITE],
    }
    const sasUrl = blob.generateSASUrl("testcontainer", "path/testblob.txt", sasOptions)

    expect(sasUrl.split("?")?.[0]).toEqual("http://127.0.0.1:10000/devstoreaccount1")

    blob.uploadData("testcontainer", "path/testblob.txt", Buffer.from("test data"), sasUrl)

    const blobExists = await blob.blobExists("testcontainer", "path/testblob.txt")

    expect(blobExists).toBe(true)
  })
})
