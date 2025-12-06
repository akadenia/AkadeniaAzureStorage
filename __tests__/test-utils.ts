/**
 * Test utilities and constants
 *
 * This file contains shared test constants including Azurite emulator connection strings.
 * These are well-known public values for the Azure Storage Emulator and are safe to commit.
 */

/**
 * Azurite emulator connection string for blob storage only
 * This is the well-known public connection string for Azurite/Azure Storage Emulator
 */
export const AZURITE_BLOB_CONNECTION_STRING =
  "DefaultEndpointsProtocol=http;AccountName=devstoreaccount1;AccountKey=Eby8vdM02xNOcqFlqUwJPLlmEtlCDXJ1OUzFT50uSRZ6IFsuFq2UVErCz4I6tq/K1SZFPTOtr/KBHBeksoGMGw==;BlobEndpoint=http://127.0.0.1:10000/devstoreaccount1;"

/**
 * Azurite emulator connection string for all storage services (blob, queue, table)
 * This is the well-known public connection string for Azurite/Azure Storage Emulator
 */
export const AZURITE_CONNECTION_STRING =
  "DefaultEndpointsProtocol=http;AccountName=devstoreaccount1;AccountKey=Eby8vdM02xNOcqFlqUwJPLlmEtlCDXJ1OUzFT50uSRZ6IFsuFq2UVErCz4I6tq/K1SZFPTOtr/KBHBeksoGMGw==;BlobEndpoint=http://127.0.0.1:10000/devstoreaccount1;QueueEndpoint=http://127.0.0.1:10001/devstoreaccount1;TableEndpoint=http://127.0.0.1:10002/devstoreaccount1;"

/**
 * Alternative Azurite connection string format
 */
export const AZURITE_USE_DEVELOPMENT_STORAGE = "UseDevelopmentStorage=true"
