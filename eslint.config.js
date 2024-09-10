const globals = require("globals");
const pluginJs = require("@eslint/js");

module.exports = [
    {
        files: ["**/*.js"],
        languageOptions: {
            sourceType: "commonjs",
            globals: {
                __dirname: "readonly",
                __filename: "readonly",
                process: "readonly",
            },
        },
        plugins: {},
        rules: {
            "no-unused-vars": ["warn", { vars: "all", args: "none", ignoreRestSiblings: true }],
        },
    },
    {
        files: ["**/*.js"],
        languageOptions: {
            globals: globals.browser,
        },
    },
    pluginJs.configs.recommended,
];
