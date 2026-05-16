const path = require("path");
const { override, addWebpackAlias } = require("customize-cra");

module.exports = override(
  addWebpackAlias({
    "@modules": path.resolve(__dirname, "src", "modules"),
    "@shared": path.resolve(__dirname, "src", "shared"),
    "@assets": path.resolve(__dirname, "src", "assets"),
  }),
);
