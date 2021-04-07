import { setup, defaultClient } from 'applicationinsights';
import { Contracts } from "applicationinsights";
import { Data, ExceptionData, RemoteDependencyData } from "applicationinsights/out/Declarations/Contracts";
import fetch from 'node-fetch';
import { BlobClient } from "@azure/storage-blob";

const telemetryConsoleLogger = (envelope: Contracts.Envelope, _contextObjects?: {
  [name: string]: unknown;
}): boolean => {
  switch (envelope.data.baseType) {
    case "RemoteDependencyData": {
      const data = envelope.data as Data<RemoteDependencyData>;
      if (data.baseData.type.toLowerCase() !== "http") {
        break;
      };
      console.log("## DEPENDENCY ######################################################");
      console.log(data.baseData.data);
      console.log("########################################################");
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

void (async function () {
  setup("_your_ikey_").start();

  defaultClient.addTelemetryProcessor(telemetryConsoleLogger);

  const depUrl1 = 'https://github.com/';
  const response1 = await fetch(depUrl1);
  const body1 = await response1.text();
  console.log(depUrl1, body1.length);

  const cn = "BlobEndpoint=https://...."; // Connection string

  const containerName = "yourContainerName";
  const blobPath = "yourBlobPath";

  const bc = new BlobClient(cn, containerName, blobPath);
  const buf = await bc.downloadToBuffer();
  console.log("Size of downloaded blob", buf.byteLength);

  const depUrl2 = 'https://github.com/Azure/azure-sdk-for-js';
  const response2 = await fetch(depUrl2);
  const body2 = await response2.text();
  console.log(depUrl2, body2.length);
})();
