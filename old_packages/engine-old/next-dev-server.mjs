import path from 'path';
import http from 'http';
import https from 'https';
import fs from 'fs';

import express from 'express';
// import * as vite from 'vite';
import httpProxy from 'http-proxy';
import childProcess from 'child_process';

//

// const isProduction = process.env.NODE_ENV === 'production';
const vercelJson = JSON.parse(fs.readFileSync('./vercel.json', 'utf8'));

const SERVER_NAME = 'local.webaverse.com';
// const MULTIPLAYER_NAME = 'local-multiplayer.webaverse.com';
const COMPILER_NAME = 'local-compiler.webaverse.com';
// const WIKI_NAME = 'local-previewer.webaverse.com';
// const PREVIEWER_NAME = 'local-previewer.webaverse.com';
const COMPILER_PORT = parseInt(process.env.COMPILER_PORT, 10) || 3333;

const port = parseInt(process.env.PORT, 10) || 443;
const DEV_SERVER_PORT = parseInt(process.env.DEV_SERVER_PORT, 10) || 9999;

//

const dirname = path.dirname(import.meta.url.replace(/^file:\/\//, ''));
Error.stackTraceLimit = 300;

//

const _tryReadFile = p => {
  try {
    return fs.readFileSync(p);
  } catch(err) {
    // console.warn(err);
    return null;
  }
};
const certs = {
  key: _tryReadFile('./certs/privkey.pem') || _tryReadFile('./certs-local/privkey.pem'),
  cert: _tryReadFile('./certs/fullchain.pem') || _tryReadFile('./certs-local/fullchain.pem'),
};

//

const {headers: headerSpecs} = vercelJson;
const headerSpec0 = headerSpecs[0];
const {headers} = headerSpec0;
const _setHeaders = res => {
  for (const {key, value} of headers) {
    res.setHeader(key, value);
  }
};

//

const _proxyUrl = (req, res, u) => {
  const proxyReq = /^https:/.test(u) ? https.request(u) : http.request(u);
  for (const header in req.headers) {
    proxyReq.setHeader(header, req.headers[header]);
  }
  proxyReq.on('response', proxyRes => {
    for (const header in proxyRes.headers) {
      res.setHeader(header, proxyRes.headers[header]);
    }
    res.statusCode = proxyRes.statusCode;
    proxyRes.pipe(res);
  });
  proxyReq.on('error', err => {
    console.error(err);
    res.statusCode = 500;
    res.end();
  });
  proxyReq.end();
};

//

const serveDirectories = [
  '/packages/scenes/',
  '/packages/characters/',
  '/packages/wsrtc/',
];
const _proxyFile = (req, res, u) => {
  u = path.join(dirname, u);
  // console.log('proxy file', u);
  const rs = fs.createReadStream(u);
  rs.on('error', err => {
    console.warn(err);
    res.statusCode = 404;
    res.end(err.stack);
  });
  rs.pipe(res);
};

// main

const cp = childProcess.spawn(process.argv[0], ['./node_modules/.bin/next', 'dev'], {
 env: {
  ...process.env,
  PORT: DEV_SERVER_PORT,
 },
 stdio: 'inherit',
});

(async () => {
  const app = express();
  const proxyUrl = `http://localhost:${DEV_SERVER_PORT}/`;
  const proxyServer = httpProxy.createProxyServer({
    // target: proxyUrl,
    // // rewrite origin
    // changeOrigin: true,
    // // rewrite host
    // autoRewrite: true,
  });

  app.all('*', async (req, res, next) => {
    // console.log('got headers', req.method, req.url, req.headers);

    if (req.headers.host === COMPILER_NAME) {
      console.log('proxy compiler', req.method, req.url);
      const u = `http://localhost:${COMPILER_PORT}${req.url}`;
      _setHeaders(res);
      _proxyUrl(req, res, u);
    } else if (serveDirectories.some(d => req.url.startsWith(d))) {
      _setHeaders(res);
      _proxyFile(req, res, req.url);
    } else {
      proxyServer.web(req, res, {target: proxyUrl}, next);
    }
  });

  const isHttps = !process.env.HTTP_ONLY && (!!certs.key && !!certs.cert);
  // const wsPort = port + 1;

  const _makeHttpServer = () => isHttps ? https.createServer(certs, app) : http.createServer(app);
  const httpServer = _makeHttpServer();
  // const viteServer = await vite.createServer({
  //   mode: isProduction ? 'production' : 'development',
  //   server: {
  //     middlewareMode: true,
  //     // force: true,
  //     hmr: {
  //       server: httpServer,
  //       port,
  //       overlay: false,
  //     },
  //   }
  // });
  // app.use(viteServer.middlewares);
  
  await new Promise((accept, reject) => {
    httpServer.listen(port, '0.0.0.0', () => {
      accept();
    });
    httpServer.on('error', reject);
  });
  // console.log('pid', process.pid);
  console.log(`  > Local: http${isHttps ? 's' : ''}://${SERVER_NAME}:${port}/`);
})();

process.on('disconnect', function() {
  console.log('dev-server parent exited')
  cp.kill(9);
  process.exit();
});
['SIGINT', 'SIGTERM'].forEach(signal => {
  process.on(signal, () => {
    console.log('dev-server SIGINT')
    cp.kill(9);
    process.exit();
  });
});