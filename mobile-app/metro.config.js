const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Add support for TypeScript and other file extensions
config.resolver.sourceExts.push('js', 'json', 'ts', 'tsx', 'jsx');

// Add support for SVG files
config.resolver.assetExts.push('svg');

// Configure module resolution for monorepo structure
config.resolver.alias = {
  '@': './src',
  '@shared': '../shared',
  '@components': './src/components',
  '@screens': './src/screens',
  '@navigation': './src/navigation',
  '@services': './src/services',
  '@hooks': './src/hooks',
  '@contexts': './src/contexts',
  '@utils': './src/utils',
  '@assets': './assets',
};

// Fix Metro resolver issues with Node.js modules
config.resolver.platforms = ['native', 'ios', 'android', 'web'];

// Configure transformer for better performance
config.transformer.minifierConfig = {
  ecmaVersion: 8,
  keep_fnames: true,
  mangle: {
    keep_fnames: true,
  },
};

// Enable source maps for better debugging
config.transformer.enableBabelRCLookup = false;

module.exports = config;
