import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const distDir = path.join(root, 'dist');
const htmlPath = path.join(distDir, 'index.html');
const standalonePath = path.join(root, 'PCB_Yield_Analyzer.html');
const distStandalonePath = path.join(distDir, 'PCB_Yield_Analyzer.html');

const html = await readFile(htmlPath, 'utf8');
const scriptMatch = html.match(/<script type="module" crossorigin src="([^"]+)"><\/script>/);
const styleMatch = html.match(/<link rel="stylesheet" crossorigin href="([^"]+)">/);

if (!scriptMatch || !styleMatch) {
  throw new Error('Unable to find Vite assets in dist/index.html');
}

const assetPath = (assetUrl) => path.join(distDir, assetUrl.replace(/^\/PCB-Yield-Visualizer\//, ''));
const [script, style] = await Promise.all([
  readFile(assetPath(scriptMatch[1]), 'utf8'),
  readFile(assetPath(styleMatch[1]), 'utf8')
]);

const standalone = `<!doctype html>
<html lang="ko">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>PCB Panel Yield Visualizer</title>
    <style>
${style}
    </style>
  </head>
  <body>
    <div id="root"></div>
    <script type="module">
${script}
    </script>
  </body>
</html>
`;

await mkdir(distDir, { recursive: true });
await Promise.all([
  writeFile(standalonePath, standalone),
  writeFile(distStandalonePath, standalone)
]);
