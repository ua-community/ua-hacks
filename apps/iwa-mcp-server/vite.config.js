import { defineConfig } from 'vite';
import fs from 'fs';
import injectHTML from 'vite-plugin-html-inject';

import wbn from 'rollup-plugin-webbundle';
import * as wbnSign from 'wbn-sign';
import dotenv from 'dotenv';

dotenv.config();

const plugins = [injectHTML()];

if (process.env.NODE_ENV === 'production') {
  // Get the key and decrypt it to sign the web bundle
  const key = wbnSign.parsePemKey(
    process.env.KEY || fs.readFileSync('../../certs/encrypted_key.pem'),
    process.env.KEY_PASSPHRASE ||
      (await wbnSign.readPassphrase(
        /*description=*/ '../../certs/encrypted_key.pem',
      )),
  );

  // Add the wbn bundle only during a production build
  plugins.push({
    ...wbn({
      // Ensures the web bundle is signed as an isolated web app
      baseURL: new wbnSign.WebBundleId(key).serializeWithIsolatedWebAppOrigin(),
      // Ensure that all content in the `public` directory is included in the web bundle
      static: {
        dir: 'public',
      },
      // The name of the output web bundle
      output: 'iwa-mcp-server.swbn',
      // This ensures the web bundle is signed with the key
      integrityBlockSign: {
        strategy: new wbnSign.NodeCryptoSigningStrategy(key),
      },
    }),
    enforce: 'post',
  });
}
export default defineConfig({
  plugins,
  server: {
    port: 4321,
    hmr: {
      protocol: 'ws',
      host: 'localhost',
      clientPort: 4321,
    }
  },
  build: {
    rollupOptions: {
      input: {
        main: './index.html',
      },
    },
  },
});
