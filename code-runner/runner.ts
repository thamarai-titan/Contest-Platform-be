import fs from "fs"

try {
  const solve = require("./solution.js");
  const testcases = JSON.parse(
    fs.readFileSync("./testcases.json", "utf8")
  );

  const results = [];

  for (const tc of testcases) {
    const output = solve(tc.input);

    results.push({
      input: tc.input,
      expectedOutput: tc.expectedOutput,
      output: String(output).trim(),
      passed:
        String(output).trim() ===
        String(tc.expectedOutput).trim()
    });
  }

  console.log(JSON.stringify(results));
} catch (error: any) {
  console.log(
    JSON.stringify({
      error: error.message
    })
  );
}