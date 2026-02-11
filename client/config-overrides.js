// Disable source map warnings for node_modules
const path = require('path');

module.exports = function override(config, env) {
  // Disable source maps generation
  config.devtool = false;
  
  // Remove source-map-loader warnings for node_modules
  if (config.module && config.module.rules) {
    config.module.rules = config.module.rules.map(rule => {
      if (rule.enforce === 'pre' && rule.loader && rule.loader.includes('source-map-loader')) {
        return {
          ...rule,
          exclude: /node_modules/
        };
      }
      return rule;
    });
  }

  return config;
};

