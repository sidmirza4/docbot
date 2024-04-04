import { NextRequest, NextResponse } from "next/server";
import path from "path";
import { writeFile } from "fs/promises";
import {
  ServiceContext,
  serviceContextFromDefaults,
  SimpleDirectoryReader,
  storageContextFromDefaults,
  VectorStoreIndex,
  MilvusVectorStore,
  Document,
  PDFReader,
} from "llamaindex";
import removeDirectory from "@/app/utils/removeDir";
import { getMilvusClient } from "../chat/engine/shared.mjs";

import * as dotenv from "dotenv";

// Load environment variables from local .env file
dotenv.config();

import { CHUNK_OVERLAP, CHUNK_SIZE } from "../chat/engine/constants.mjs";

const DATA_DIR = path.join(process.cwd(), "data");
const STORAGE_CACHE_DIR = path.join(process.cwd(), "cache");

export async function POST(request: NextRequest) {
  // try {
  const formData = await request.formData();

  const file = formData.get("file") as File;

  const fileReader = file.stream().getReader();
  const fileDataU8: number[] = [];

  while (true) {
    const { done, value } = await fileReader.read();
    if (done) break;
    // @ts-ignore
    fileDataU8.push(...value);
  }

  const reader = new PDFReader();
  const pdfDoc = await reader.loadData(fileDataU8.toString());

  return NextResponse.json({ Message: "Success", status: 201 });

  //   if (!file) {
  //     return NextResponse.json(
  //       { error: "No files received." },
  //       { status: 400 },
  //     );
  //   }

  //   const _buffer = Buffer.from(await file.arrayBuffer());
  //   const fileSplitted = file.name.split(".");
  //   const ext = fileSplitted[fileSplitted.length - 1];
  //   const filename = `data-file.${ext}`;

  //   // const blob = new Blob([_buffer]);

  //   try {
  //     // Connect to Milvus
  //     const milvusClient = getMilvusClient();
  //     const vectorStore = new MilvusVectorStore({ milvusClient });

  //     // now create an index from all the Documents and store them in Milvus
  //     const storageContext = await storageContextFromDefaults({ vectorStore });

  //     // const reader = new PDFReader();
  //     // const document = reader.loadData(file);

  //     // await VectorStoreIndex.fromDocuments(documents, {
  //     //   storageContext: storageContext,
  //     // });
  //     return NextResponse.json({ Message: "Success", status: 201 });
  //   } catch (error) {
  //     console.log("Error occurred ", error);
  //     return NextResponse.json({ Message: "Failed", status: 500 });
  //   }
  // } catch (error) {}
}

async function getDocuments() {
  return await new SimpleDirectoryReader().loadData({
    directoryPath: DATA_DIR,
  });
}

async function deletePreviousContext() {
  await removeDirectory(STORAGE_CACHE_DIR);
}

async function getRuntime(func: Function) {
  const start = Date.now();
  await func();
  const end = Date.now();
  return end - start;
}

async function generateDatasource(serviceContext: ServiceContext) {
  console.log(`Generating storage context...`);
  // Split documents, create embeddings and store them in the storage context
  const ms = await getRuntime(async () => {
    const storageContext = await storageContextFromDefaults({
      persistDir: STORAGE_CACHE_DIR,
    });
    const documents = await getDocuments();
    await VectorStoreIndex.fromDocuments(documents, {
      storageContext,
      serviceContext,
    });
  });
  console.log(`Storage context successfully generated in ${ms / 1000}s.`);
}

const generateContext = async () => {
  const serviceContext = serviceContextFromDefaults({
    chunkSize: CHUNK_SIZE,
    chunkOverlap: CHUNK_OVERLAP,
  });

  await generateDatasource(serviceContext);
  console.log("Finished generating storage.");
};
