const path = require("path");
const { override, addWebpackAlias } = require("customize-cra");

// Import .hbs templates as raw source strings (compiled at runtime with handlebars).
// The rule must go INSIDE CRA's `oneOf` block, before the catch-all file-loader,
// otherwise that fallback would emit the .hbs as a static file and conflict.
const addHbsRawLoader = (config) => {
  const oneOf = config.module.rules.find((rule) => Array.isArray(rule.oneOf))?.oneOf;
  if (oneOf) {
    oneOf.unshift({ test: /\.hbs$/, type: "asset/source" });
  } else {
    config.module.rules.push({ test: /\.hbs$/, type: "asset/source" });
  }
  return config;
};

module.exports = override(
  addWebpackAlias({
    "@modules": path.resolve(__dirname, "src", "modules"),
    "@shared": path.resolve(__dirname, "src", "shared"),
    "@assets": path.resolve(__dirname, "src", "assets"),
  }),
  addHbsRawLoader,
);
