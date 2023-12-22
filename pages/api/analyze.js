// pages/api/runPythonScript.js
import { exec } from "child_process";
import path from "path";

// The handler function must be async to use await inside it
export default async function handler(req, res) {
  // Define the path to your Python executable inside the virtual environment
  const pythonEnvPath = path.join(process.cwd(), "venv/bin/python");

  // Define the relative path to your script from the project root
  const scriptPath = path.join(process.cwd(), "scripts/text_analysis.py");

  const runPythonScript = () =>
    new Promise((resolve, reject) => {
      exec(`"${pythonEnvPath}" "${scriptPath}"`, (err, stdout, stderr) => {
        if (err) {
          reject(err);
        } else if (stderr) {
          reject(new Error(stderr));
        } else {
          resolve(stdout);
        }
      });
    });

  try {
    // Run the Python script and wait for the result
    const output = await runPythonScript();
    const parsedOutput = JSON.parse(output);
    res.status(200).json(parsedOutput);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
}
