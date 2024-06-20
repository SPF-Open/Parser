import dts from 'bun-plugin-dts';

await Bun.build({
  entrypoints: ['./src/index.ts'],
  outdir: './dist/',
  target: 'bun',
  minify: true,
  plugins: [dts()],
}).catch((e) => {
  console.error(e);
  process.exit(1);
}).then(() => {
  console.log('build done');
});