import { createServer } from 'node:http';
import { access, mkdtemp, readFile, rm, stat } from 'node:fs/promises';
import { spawn } from 'node:child_process';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const publicDir = path.join(root, 'public');
const outputPath = path.join(publicDir, 'Jeanine-Cornillot-Press-Kit.pdf');

const chromeCandidates = [
  process.env.CHROME_PATH,
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/Applications/Chromium.app/Contents/MacOS/Chromium',
  '/usr/bin/google-chrome',
  '/usr/bin/chromium',
  '/usr/bin/chromium-browser',
].filter(Boolean);

const mimeTypes = new Map([
  ['.html', 'text/html; charset=utf-8'],
  ['.css', 'text/css; charset=utf-8'],
  ['.js', 'text/javascript; charset=utf-8'],
  ['.json', 'application/json; charset=utf-8'],
  ['.pdf', 'application/pdf'],
  ['.png', 'image/png'],
  ['.jpg', 'image/jpeg'],
  ['.jpeg', 'image/jpeg'],
  ['.svg', 'image/svg+xml'],
  ['.ttf', 'font/ttf'],
  ['.woff2', 'font/woff2'],
]);

const findChrome = async () => {
  for (const candidate of chromeCandidates) {
    try {
      await access(candidate);
      return candidate;
    } catch {
      // Try the next known installation path.
    }
  }
  throw new Error('Chrome or Chromium was not found. Set CHROME_PATH to a browser executable.');
};

const safePublicPath = (requestUrl) => {
  const pathname = decodeURIComponent(new URL(requestUrl, 'http://127.0.0.1').pathname);
  const relativePath = pathname === '/' ? 'press.html' : pathname.replace(/^\/+/, '');
  const resolved = path.resolve(publicDir, relativePath);
  if (!resolved.startsWith(`${publicDir}${path.sep}`)) return null;
  return resolved;
};

const servePublic = () => new Promise((resolve, reject) => {
  const server = createServer(async (request, response) => {
    const filePath = safePublicPath(request.url || '/');
    if (!filePath) {
      response.writeHead(403).end('Forbidden');
      return;
    }

    try {
      const body = await readFile(filePath);
      response.writeHead(200, {
        'Content-Type': mimeTypes.get(path.extname(filePath).toLowerCase()) || 'application/octet-stream',
        'Cache-Control': 'no-store',
      });
      response.end(body);
    } catch {
      response.writeHead(404).end('Not found');
    }
  });

  server.once('error', reject);
  server.listen(0, '127.0.0.1', () => resolve(server));
});

const runChrome = (chromePath, args, expectedOutput) => new Promise((resolve, reject) => {
  const child = spawn(chromePath, args, { stdio: ['ignore', 'pipe', 'pipe'] });
  let stderr = '';
  let pdfComplete = false;
  let forceKillTimer;
  let lastOutputSize = 0;
  let stableOutputPolls = 0;

  const stopTimers = () => {
    clearInterval(outputPoll);
    clearTimeout(hardTimeout);
    clearTimeout(forceKillTimer);
  };

  const outputPoll = setInterval(async () => {
    try {
      const output = await stat(expectedOutput);
      if (output.size < 10_000) return;
      stableOutputPolls = output.size === lastOutputSize ? stableOutputPolls + 1 : 0;
      lastOutputSize = output.size;
      if (stableOutputPolls < 2) return;
      pdfComplete = true;
      child.kill('SIGTERM');
      forceKillTimer = setTimeout(() => child.kill('SIGKILL'), 1_500);
    } catch {
      // Chrome has not finished writing the PDF yet.
    }
  }, 500);

  const hardTimeout = setTimeout(() => {
    child.kill('SIGKILL');
  }, 30_000);

  child.stderr.on('data', (chunk) => { stderr += chunk; });
  child.once('error', (error) => {
    stopTimers();
    reject(error);
  });
  child.once('exit', (code) => {
    stopTimers();
    if (code === 0 || pdfComplete) resolve();
    else reject(new Error(`Chrome exited with code ${code}. ${stderr.trim()}`));
  });
});

const main = async () => {
  const chromePath = await findChrome();
  const server = await servePublic();
  const address = server.address();
  const profileDir = await mkdtemp(path.join(tmpdir(), 'press-pdf-chrome-'));

  try {
    const url = `http://127.0.0.1:${address.port}/press.html`;
    await rm(outputPath, { force: true });
    await runChrome(chromePath, [
      '--headless=new',
      '--disable-gpu',
      '--disable-extensions',
      '--disable-background-networking',
      '--hide-scrollbars',
      '--no-pdf-header-footer',
      '--run-all-compositor-stages-before-draw',
      '--virtual-time-budget=3000',
      `--user-data-dir=${profileDir}`,
      `--print-to-pdf=${outputPath}`,
      url,
    ], outputPath);

    const output = await stat(outputPath);
    if (output.size < 10_000) throw new Error('Generated PDF is unexpectedly small.');
    console.log(`Wrote ${outputPath}`);
  } finally {
    server.closeAllConnections?.();
    await new Promise((resolve) => server.close(resolve));
    await rm(profileDir, { recursive: true, force: true });
  }
};

await main();
