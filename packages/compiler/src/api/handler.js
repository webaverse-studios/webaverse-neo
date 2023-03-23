// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import fs from 'fs';
import path from 'path';

import etag from 'etag';

import compile from './compile.js';
import {getCwd} from '../utils/index.js';
import {absoluteImportRegex} from '../lib/index.js';

/**
 * Proxy request
 *
 * @type {import('next').NextApiHandler}
 */
async function proxyRequest(req, res, url) {
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', '*');
  res.setHeader('Access-Control-Allow-Headers', '*');
  res.setHeader('Cross-Origin-Opener-Policy', 'unsafe-none');
  res.setHeader('Cross-Origin-Embedder-Policy', 'require-corp');
  res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');

  if (absoluteImportRegex.test(url)) {
    url = path.join(getCwd(), url);

    const resultBuffer = await fs.promises.readFile(url);

    const et = etag(resultBuffer);
    res.setHeader('ETag', et);

    if (
      req.headers['if-none-match'] &&
      req.headers['if-none-match'].split(',').includes(et)
    ) {
      console.log('304 asset', url);
      res.statusCode = 304;
      return res.end();
    }

    console.log('200 asset', url);
    return res.end(resultBuffer);
  }

  return res.redirect(url);
}

/**
 * Handle requests
 *
 * @type {import('next').NextApiHandler}
 */
export async function handler(req, res) {
  const url = req.url
    // remove initial slash
    .replace(/^\/([a-zA-Z0-9]+:)/, '$1')
    // add second slash to protocol, since it is truncated
    .replace(/^([a-zA-Z0-9]+:\/(?!\/))/, '$1/');

  if (!url) {
    return res.status(404).send('not found');
  }

  // XXX note: sec-fetch-dest is not supported by Safari
  const dest =
    req.headers['x-fetch-dest'] ?? req.headers['sec-fetch-dest'] ?? '';

  if (['empty', 'image'].includes(dest) || dest.includes('github.io')) {
    try {
      await proxyRequest(req, res, url);
    } catch (err) {
      res.send(500, err.stack);
    }
  } else {
    let resultUint8Array, err;
    try {
      resultUint8Array = await compile(url);
    } catch (e) {
      err = e;
    }

    if (err) {
      console.warn(err);
      return res.status(500).send(err.stack);
    }

    const resultBuffer = Buffer.from(resultUint8Array);
    const et = etag(resultBuffer);
    res.setHeader('ETag', et);

    // check if-none-match (multiple)
    res.setHeader('Content-Type', 'application/javascript');

    if (
      req.headers['if-none-match'] &&
      req.headers['if-none-match'].split(',').includes(et)
    ) {
      res.statusCode = 304;
      res.setHeader('Access-Control-Allow-Methods', '*');
      res.setHeader('Access-Control-Allow-Headers', '*');

      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Cross-Origin-Opener-Policy', 'unsafe-none');
      res.setHeader('Cross-Origin-Embedder-Policy', 'require-corp');
      res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
      res.end();
    } else {
      res.setHeader('Access-Control-Allow-Methods', '*');
      res.setHeader('Access-Control-Allow-Headers', '*');

      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Cross-Origin-Opener-Policy', 'unsafe-none');
      res.setHeader('Cross-Origin-Embedder-Policy', 'require-corp');
      res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
      res.end(resultBuffer);
    }
  }
}
