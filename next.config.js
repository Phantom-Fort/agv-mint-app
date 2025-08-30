// next.config.js
module.exports = {
  webpack: (config) => {
    config.resolve.fallback = {
      zlib: require.resolve('browserify-zlib'),
      https: require.resolve('https-browserify'),
      stream: require.resolve('stream-browserify'),
    };
    return config;
  },
};