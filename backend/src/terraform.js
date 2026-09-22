const fs = require("fs");
const path = require("path");
const { execFile } = require("child_process");

const terraform = require("@jahed/terraform");
const { install } = require("@jahed/terraform/lib/install");

const outputs = terraform.default;

async function getTerraformStatus() {
  const terraformPath = await install(outputs);

  return new Promise((resolve, reject) => {
    execFile(
      terraformPath,
      ["version"],
      (error, stdout, stderr) => {
        if (error) {
          reject(error);
          return;
        }

        const versionLine = stdout
          .split("\n")
          .find((line) => line.startsWith("Terraform v"));

        resolve({
          installed: true,
          version: versionLine?.trim() || "Unknown",
          path: terraformPath,
        });
      }
    );
  });
}

function getTerraformProjects() {
  const projectsDir =
    process.env.TERRAFORM_PROJECTS_DIR ||
    path.join(process.cwd(), "terraform-projects");

  if (!fs.existsSync(projectsDir)) {
    return [];
  }

  const entries = fs.readdirSync(projectsDir, {
    withFileTypes: true,
  });

  return entries
    .filter((entry) => entry.isDirectory())
    .filter((entry) => {
      const projectPath = path.join(
        projectsDir,
        entry.name
      );

      return fs
        .readdirSync(projectPath)
        .some((file) => file.endsWith(".tf"));
    })
    .map((entry) => {
      const projectPath = path.join(
        projectsDir,
        entry.name
      );

      return {
        name: entry.name,
        path: projectPath,
      };
    });
}

function getProjectsDirectory() {
  return path.resolve(
    process.env.TERRAFORM_PROJECTS_DIR ||
      path.join(process.cwd(), "terraform-projects")
  );
}

function validateTerraformProject(projectName) {
  const projectsDir = getProjectsDirectory();

  const projectPath = path.resolve(
    projectsDir,
    projectName
  );

  const relativePath = path.relative(
    projectsDir,
    projectPath
  );

  if (
    relativePath.startsWith("..") ||
    path.isAbsolute(relativePath)
  ) {
    throw new Error("Invalid Terraform project");
  }

  if (!fs.existsSync(projectPath)) {
    throw new Error("Terraform project not found");
  }

  if (!fs.statSync(projectPath).isDirectory()) {
    throw new Error("Terraform project is not a directory");
  }

  const hasTerraformFile = fs
    .readdirSync(projectPath)
    .some((file) => file.endsWith(".tf"));

  if (!hasTerraformFile) {
    throw new Error(
      "Directory does not contain Terraform files"
    );
  }

  return projectPath;
}

function cleanTerraformOutput(output) {
  return output
    .replace(/\x1B(?:[@-Z\\-_]|\[[0-?]*[ -/]*[@-~])/g, "")
    .trim();
}

function runTerraformCommand(
  terraformPath,
  args,
  cwd
) {
  return new Promise((resolve, reject) => {
    execFile(
      terraformPath,
      args,
      {
        cwd,
        maxBuffer: 10 * 1024 * 1024,
      },
      (error, stdout, stderr) => {
        const cleanStdout =
          cleanTerraformOutput(stdout);

        const cleanStderr =
          cleanTerraformOutput(stderr);

        if (error) {
          const output =
            cleanStdout ||
            cleanStderr ||
            error.message;

          reject(
            new Error(output.trim())
          );

          return;
        }

        resolve({
          stdout: cleanStdout,
          stderr: cleanStderr,
        });
      }
    );
  });
}

async function runTerraformPlan(
  projectName
) {
  const terraformPath = await install(outputs);

  const projectPath =
    validateTerraformProject(projectName);

  await runTerraformCommand(
    terraformPath,
    ["init", "-input=false"],
    projectPath
  );

  const planResult =
    await runTerraformCommand(
      terraformPath,
      [
        "plan",
        "-input=false",
        "-no-color",
      ],
      projectPath
    );

  return {
    project: projectName,
    path: projectPath,
    output: planResult.stdout,
  };
}

function getTerraformProject(projectName) {
  const projectPath =
    validateTerraformProject(projectName);

  const files = fs
    .readdirSync(projectPath, {
      withFileTypes: true,
    })
    .filter((entry) => entry.isFile())
    .map((entry) => entry.name);

  const terraformFiles = files.filter((file) =>
    file.endsWith(".tf")
  );

  const variableFiles = files.filter(
    (file) =>
      file === "terraform.tfvars" ||
      file === "terraform.tfvars.json" ||
      file.endsWith(".auto.tfvars") ||
      file.endsWith(".auto.tfvars.json")
  );

  return {
    name: projectName,
    path: projectPath,
    files,
    terraformFiles,
    variableFiles,
  };
}

async function validateTerraformProjectConfig(projectName) {
  const terraformPath = await install(outputs);

  const projectPath =
    validateTerraformProject(projectName);

  await runTerraformCommand(
    terraformPath,
    ["init", "-backend=false", "-input=false"],
    projectPath
  );

  const result = await runTerraformCommand(
    terraformPath,
    ["validate", "-no-color"],
    projectPath
  );

  return {
    project: projectName,
    path: projectPath,
    output: result.stdout,
  };
}

async function runTerraformInit(projectName) {
  const terraformPath = await install(outputs);

  const projectPath =
    validateTerraformProject(projectName);

  const result = await runTerraformCommand(
    terraformPath,
    ["init", "-input=false"],
    projectPath
  );

  return {
    project: projectName,
    path: projectPath,
    output: result.stdout,
  };
}

module.exports = {
  getTerraformStatus,
  getTerraformProjects,
  runTerraformPlan,
  getTerraformProject,
  validateTerraformProjectConfig,
  runTerraformInit,
};