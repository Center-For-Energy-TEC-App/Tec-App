import globals from "globals";
import pluginReactConfig from "eslint-plugin-react/configs/recommended.js";
import eslintConfigPrettier from "eslint-config-prettier";

export default [
  { languageOptions: { globals: globals.browser } },
  pluginReactConfig,
  eslintConfigPrettier, //MUST BE LAST!!!!!
];
