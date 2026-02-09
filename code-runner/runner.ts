import fs from "fs"

const solve = require("./solution");
const testcases = JSON.parse(fs.readFileSync("./testcases.json", "utf-8"))

const results = [];

for (const tc of testcases) {
    try {
        const output = solve(tc.input)
        results.push({
            input: tc.input,
            expected: tc.expected,
            output: String(output),
            pass: String(output) === tc.expected
        })
    }
    catch (err: any){
        results.push({
            error: err.message,
            pass: false
        })
    }
}

console.log(JSON.stringify(results))