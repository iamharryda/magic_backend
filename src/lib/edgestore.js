import { initEdgeStore } from '@edgestore/server';
import { createEdgeStoreExpressHandler } from '@edgestore/server/adapters/express';
import { initEdgeStoreClient } from '@edgestore/server/core';
import dotenv from 'dotenv';
dotenv.config();

const es = initEdgeStore.create();

export const edgeStoreRouter = es.router({
  publicFiles: es.fileBucket(),
  publicImages: es.imageBucket(),
});

export const edgeStoreHandler = createEdgeStoreExpressHandler({
  router: edgeStoreRouter,
  accessKey: process.env.EDGE_STORE_ACCESS_KEY,
  secretKey: process.env.EDGE_STORE_SECRET_KEY,
});

export const edgeStoreClient = initEdgeStoreClient({
  router: edgeStoreRouter,
  accessKey: process.env.EDGE_STORE_ACCESS_KEY,
  secretKey: process.env.EDGE_STORE_SECRET_KEY,
  baseUrl: process.env.EDGE_STORE_BASE_URL || 'http://localhost:5006/api/v1/edgestore',
});
