module.exports = function override(config) {

  config.resolve.fallback = {
    ...config.resolve.fallback,
    fs: false,
    util: require.resolve("util/")
  };

  return config;
};