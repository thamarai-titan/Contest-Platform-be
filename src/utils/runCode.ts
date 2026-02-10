import { execFile } from "child_process";
import fs from "fs";
import path from "path";

export function runCode(
  code: string,
  testcases: { input: string; expected: string }[]
): Promise<any> {
  return new Promise((resolve, reject) => {
    const id = Date.now().toString();
    const runDir = path.join(process.cwd(), "tmp", id);

    try {
      fs.mkdirSync(runDir, { recursive: true });


      fs.writeFileSync(
        path.join(runDir, "solution.js"),
        `
module.exports = function solve(input) {
${code}
}
`
      );


      fs.writeFileSync(
        path.join(runDir, "testcases.json"),
        JSON.stringify(testcases)
      );


      execFile(
        "docker",
        [
          "run",
          "--rm",
          "--memory=128m",
          "--cpus=0.5",
          "--network",
          "none",
          "-v",
          `${runDir}:/app`,
          "js-code-runner"
        ],
        { timeout: 3000 },
        (err, stdout, stderr) => {
          fs.rmSync(runDir, { recursive: true, force: true });

          if (err) {
            return reject(stderr || err.message);
          }

          try {
            const result = JSON.parse(stdout);
            resolve(result);
          } catch (parseError) {
            reject("Invalid runner output");
          }
        }
      );
    } catch (error: any) {
      fs.rmSync(runDir, { recursive: true, force: true });
      reject(error.message);
    }
  });                                                                                                        
}