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

module.exports = {
  getTerraformStatus,
  getTerraformProjects,
};