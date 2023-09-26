# Vite Plugin WebP Compress

A Vite plugin for compressing and converting JPG and PNG images to WebP format during the build process.

## Installation

Install the plugin via npm, yarn, or pnpm:

```bash
npm install vite-plugin-webp-compress --save-dev
# or
yarn add vite-plugin-webp-compress --dev
# or
pnpm add vite-plugin-webp-compress -D
```

## Usage

Add the plugin to your Vite config:

```javascript
import VitePluginWebpCompress from 'vite-plugin-webp-compress';

export default {
  plugins: [
    VitePluginWebpCompress()
  ]
}

```

## Options
This plugin currently doesn't have any configurable options.

