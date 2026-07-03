// In production, use cPanel environment variables only (do not load .env from disk).
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const path = require('path');
const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');

const dir = __dirname;
const port = parseInt(process.env.PORT || '3000', 10);
const hostname = process.env.HOSTNAME || '0.0.0.0';

const app = next({ dev: false, dir, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  createServer((req, res) => {
    const parsedUrl = parse(req.url, true);
    handle(req, res, parsedUrl);
  }).listen(port, hostname, () => {
    console.log(`Next.js ready on http://${hostname}:${port}`);
  });
});
