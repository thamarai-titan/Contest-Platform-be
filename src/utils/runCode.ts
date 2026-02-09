import { exec } from "child_process";
import fs from "fs";
import path from "path";

export function runCode(
  code: string,
  testcases: { input: string; expected: string }[]
): Promise<any> {
  return new Promise((resolve, reject) => {
    const id = Date.now().toString();
    const runDir = path.join(process.cwd(), "..", "tmp", id);

    fs.mkdirSync(runDir, { recursive: true });

    // 1️⃣ write user code
    fs.writeFileSync(
      path.join(runDir, "solution.js"),
      `
      module.exports = function solve(input) {
        ${code}
      }
      `
    );

    // 2️⃣ write testcases
    fs.writeFileSync(
      path.join(runDir, "testcases.json"),
      JSON.stringify(testcases)
    );

    // 3️⃣ run docker
    const command = `
      docker run --rm \
        --memory=128m \
        --cpus=0.5 \
        --network none \
        -v ${runDir}:/app \
        js-code-runner
    `;

    exec(command, { timeout: 3000 }, (err, stdout, stderr) => {
      fs.rmSync(runDir, { recursive: true, force: true });

      if (err) {
        return reject(stderr || err.message);
      }

      resolve(JSON.parse(stdout));
    });
  });
}
