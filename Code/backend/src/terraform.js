const {
    getTerraformStatus,
  } = require("./terraform");

const { execFile } = require("child_process");

function getTerraformStatus() {
  return new Promise((resolve, reject) => {
    execFile(
      "terraform",
      ["version"],
      (error, stdout, stderr) => {
        if (error) {
          reject(error);
          return;
        }

        const versionLine = stdout
          .split("\n")
          .find((line) =>
            line.startsWith("Terraform v")
          );

        const version =
          versionLine?.trim() || "Unknown";

        resolve({
          installed: true,
          version,
          path: "/usr/bin/terraform",
        });
      }
    );
  });
}

module.exports = {
  getTerraformStatus,
};