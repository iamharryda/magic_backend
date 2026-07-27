import { initEdgeStore } from '@edgestore/server';
import { createEdgeStoreExpressHandler } from '@edgestore/server/adapters/express';
import dotenv from 'dotenv';
dotenv.config();

const es = initEdgeStore.create();

const edgeStoreRouter = es.router({
  publicFiles: es.fileBucket(),
  publicImages: es.imageBucket(),
});

export const edgeStoreHandler = createEdgeStoreExpressHandler({
  router: edgeStoreRouter,
  accessKey: process.env.EDGE_STORE_ACCESS_KEY,
  secretKey: process.env.EDGE_STORE_SECRET_KEY,
});
