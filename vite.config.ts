import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import { fileURLToPath } from 'node:url';

const isDev = process.env.NODE_ENV !== 'production';

export default defineConfig({
	plugins: [tailwindcss(), sveltekit()],
	resolve: {
		alias: isDev
			? [
					{
						// `cloudflare:workers` only exists at runtime on Workers; alias
						// it to a no-op stub during `vite dev` so importing it doesn't
						// crash the SSR runner. Production builds drop the alias and
						// leave the import external (see `build.rollupOptions.external`),
						// so the real Workers module is used at runtime.
						find: 'cloudflare:workers',
						replacement: fileURLToPath(
							new URL('./src/lib/server/stubs/cloudflare-workers.ts', import.meta.url)
						)
					}
				]
			: []
	},
	build: {
		rollupOptions: { external: ['cloudflare:workers'] }
	}
});
