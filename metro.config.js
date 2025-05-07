const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require('nativewind/metro');

const config = getDefaultConfig(__dirname)


// Add 'mjs' to supported source file extensions
config.resolver.sourceExts = [...config.resolver.sourceExts, 'mjs'];


module.exports = withNativeWind(config, { input: './global.css' })