/**
 * Post-build step: bundle Durable Object classes and inject them into the
 * SvelteKit Cloudflare adapter's generated _worker.js so they're exported
 * from the worker entrypoint (a wrangler requirement for DO bindings).
 *
 * Adapter-cloudflare doesn't natively support DOs, so we:
 *   1. esbuild-bundle each DO module (cloudflare:workers external)
 *   2. Hoist a single static `import { DurableObject } from "cloudflare:workers"`
 *   3. Append each bundled class body and a `export { ClassName }` line
 */
import { build } from 'esbuild';
import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');
const workerFile = resolve(root, '.svelte-kit/cloudflare/_worker.js');

// Each entry: source file → exported class name.
const DO_CLASSES = [
	{ entry: 'src/lib/server/PatchSession.ts', name: 'PatchSession' },
	{ entry: 'src/lib/server/Registry.ts', name: 'Registry' }
];

const marker = '/* __ICHOR_DO_INJECTED__ */';
let worker = await readFile(workerFile, 'utf8');

if (worker.includes(marker)) {
	console.log('[inject-do] already injected, skipping');
	process.exit(0);
}

const bodies = [];
for (const { entry, name } of DO_CLASSES) {
	const result = await build({
		entryPoints: [resolve(root, entry)],
		bundle: true,
		format: 'esm',
		platform: 'neutral',
		target: 'es2022',
		external: ['cloudflare:workers'],
		write: false,
		logLevel: 'silent'
	});
	const src = result.outputFiles[0].text;
	const stripped = src
		.replace(/import\s*{[^}]*}\s*from\s*["']cloudflare:workers["'];?\s*/g, '')
		.replace(/export\s*{[^}]*};?\s*$/m, '');
	bodies.push({ name, body: stripped });
}

// Single hoisted import at the top of the worker.
worker = `import { DurableObject } from "cloudflare:workers";\n${worker}`;

// Append each class body and export it.
let suffix = `\n${marker}\n`;
for (const { name, body } of bodies) {
	suffix += `\n${body}\nexport { ${name} };\n`;
}
worker = worker + suffix;

await writeFile(workerFile, worker);
console.log(`[inject-do] injected: ${DO_CLASSES.map((c) => c.name).join(', ')}`);
