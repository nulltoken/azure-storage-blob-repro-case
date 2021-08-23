import { setup, defaultClient } from 'applicationinsights';
import { Contracts } from "applicationinsights";
import { Data, ExceptionData, RemoteDependencyData } from "applicationinsights/out/Declarations/Contracts";
import { BlobClient } from "@azure/storage-blob";

let totalNumberOfDependencyCalls = 0;

const telemetryConsoleLogger = (envelope: Contracts.Envelope, _contextObjects?: {
  [name: string]: unknown;
}): boolean => {
  switch (envelope.data.baseType) {
    case "RemoteDependencyData": {
      const data = envelope.data as Data<RemoteDependencyData>;
      if (data.baseData.type.toLowerCase() !== "http") {
        break;
      };
      totalNumberOfDependencyCalls++;
      break;
    }

    case "ExceptionData": {
      console.log("## EXCEPTION ######################################################");
      const data = envelope.data as Data<ExceptionData>;
      data.baseData.exceptions.forEach(e => { console.log(e.message); });
      console.log("########################################################");
      break;
    }

    default:
      console.log(JSON.stringify(envelope));
  }

  return true;
};

const download = async (cn: string, containerName: string, blobPath: string): Promise<void> => {
  console.log("Downloading...");
  const bc = new BlobClient(cn, containerName, blobPath);
  const buf = await bc.downloadToBuffer();
  console.log("Size of downloaded blob", buf.byteLength);
  console.log("totalNumberOfDependencyCalls", totalNumberOfDependencyCalls)
  console.log("---------------------------------")
}

void (async function () {
  setup("_your_ikey_").start();

  defaultClient.addTelemetryProcessor(telemetryConsoleLogger);

  const cn = "BlobEndpoint=https://...."; // Connection string

  const containerName = "yourContainerName";
  const blobPath = "yourBlobPath";

  console.log("Initial totalNumberOfDependencyCalls", totalNumberOfDependencyCalls)

  await download(cn, containerName, blobPath);

  await download(cn, containerName, blobPath);

  await download(cn, containerName, blobPath);

  await download(cn, containerName, blobPath);

  await download(cn, containerName, blobPath);

  await download(cn, containerName, blobPath);

  await download(cn, containerName, blobPath);
})();
