const { ESLint } = require("eslint");
const path = require("path");
const assert = require("assert");

describe("ESLint Linting", function () {
    let eslint;

    before(async function () {
        eslint = new ESLint({
            overrideConfigFile: path.resolve(__dirname, "../eslint.config.js"),
        });
    });

    it("should not have linting errors", async function () {
        const results = await eslint.lintFiles(["src/**/*.js"]);

        const hasErrors = results.some(result => result.errorCount > 0);
        
        results.forEach(result => {
            if (result.errorCount > 0) {
                console.log(result.filePath);
                result.messages.forEach(message => {
                    console.log(`  ${message.line}:${message.column} ${message.message} (${message.ruleId})`);
                });
            }
        });

        assert.strictEqual(hasErrors, false, "Linting errors found");
    });
});
