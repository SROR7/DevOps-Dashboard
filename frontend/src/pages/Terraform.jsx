import { useRef, useState } from "react";
import {
  Boxes,
  CheckCircle2,
  CloudCog,
  FileCode2,
  FolderOpen,
  Play,
  Terminal,
  XCircle,
} from "lucide-react";

import TerraformProjectBrowser from "../components/TerraformProjectBrowser";

function Terraform() {
  const fileInputRef = useRef(null);

  const [localProject, setLocalProject] = useState(null);
  const [localFiles, setLocalFiles] = useState([]);
  const [selectedLocalFile, setSelectedLocalFile] = useState(null);

  const [planLoading, setPlanLoading] = useState(false);
  const [planOutput, setPlanOutput] = useState("");
  const [planError, setPlanError] = useState("");

  const handleBrowseTerraformProject = () => {
    fileInputRef.current?.click();
  };

  const handleTerraformFolderSelect = (event) => {
    const files = Array.from(event.target.files || []);

    if (files.length === 0) {
      return;
    }

    const firstFile = files[0];

    /*
     * webkitRelativePath looks like:
     *
     * my-terraform/main.tf
     * my-terraform/variables.tf
     *
     * The first part is the selected folder name.
     */
    const folderName =
      firstFile.webkitRelativePath?.split("/")[0] ||
      "Terraform Project";

    const terraformFiles = files
      .filter((file) => {
        const name = file.name;

        return (
          name.endsWith(".tf") ||
          name === "terraform.tfvars" ||
          name === "terraform.tfvars.json" ||
          name.endsWith(".auto.tfvars") ||
          name.endsWith(".auto.tfvars.json")
        );
      })
      .map((file) => ({
        name: file.name,
        path: file.webkitRelativePath,
        file,
      }))
      .sort((a, b) =>
        a.path.localeCompare(b.path)
      );

    if (terraformFiles.length === 0) {
      setLocalProject(null);
      setLocalFiles([]);
      setSelectedLocalFile(null);

      setPlanError(
        "The selected folder does not contain any Terraform configuration files."
      );

      return;
    }

    setLocalProject({
      name: folderName,
    });

    setLocalFiles(terraformFiles);
    setSelectedLocalFile(null);

    setPlanOutput("");
    setPlanError("");

    /*
     * Reset the input so the user can select
     * the same folder again later.
     */
    event.target.value = "";
  };

  const handleLocalFileSelect = async (file) => {
    try {
      const content = await file.file.text();

      setSelectedLocalFile({
        name: file.name,
        path: file.path,
        content,
      });

      setPlanError("");
    } catch (error) {
      console.error(
        "Failed to read Terraform file:",
        error
      );

      setPlanError(
        "Failed to read the selected Terraform file."
      );
    }
  };

  const handleClearProject = () => {
    setLocalProject(null);
    setLocalFiles([]);
    setSelectedLocalFile(null);
    setPlanOutput("");
    setPlanError("");
  };

  const handlePlan = async () => {
    if (!localProject) {
      setPlanError(
        "Please select a Terraform project first."
      );
      return;
    }

    setPlanLoading(true);
    setPlanOutput("");
    setPlanError("");

    try {
      /*
       * Terraform execution will be connected to the
       * backend after implementing project upload.
       */
      setPlanOutput(
        "Terraform project selected successfully.\n\nTerraform plan execution will be connected after implementing the project upload API."
      );
    } catch (error) {
      console.error(error);

      setPlanError(
        error.message ||
          "Failed to run Terraform plan."
      );
    } finally {
      setPlanLoading(false);
    }
  };

  return (
    <div className="content">
      {/* Hidden folder selector */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        webkitdirectory=""
        directory=""
        onChange={handleTerraformFolderSelect}
        style={{ display: "none" }}
      />

      {/* Page Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">
            Terraform
          </h1>

          <p className="page-description">
            Browse and inspect Terraform projects from
            your local machine.
          </p>
        </div>

        <button
          className="aws-console-button"
          onClick={handleBrowseTerraformProject}
        >
          <FolderOpen size={17} />
          Browse Project
        </button>
      </div>

      {/* Statistics */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-title">
              Integration
            </span>

            <div className="stat-icon">
              <CloudCog size={18} />
            </div>
          </div>

          <div className="stat-value">
            Local
          </div>

          <div className="stat-footer">
            Browser File Access
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-title">
              Project
            </span>

            <div className="stat-icon">
              <Boxes size={18} />
            </div>
          </div>

          <div className="stat-value">
            {localProject ? "Selected" : "None"}
          </div>

          <div className="stat-footer">
            {localProject
              ? localProject.name
              : "No project selected"}
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-title">
              Terraform Files
            </span>

            <div className="stat-icon">
              <FileCode2 size={18} />
            </div>
          </div>

          <div className="stat-value">
            {localFiles.length}
          </div>

          <div className="stat-footer">
            Configuration files
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-title">
              Status
            </span>

            <div className="stat-icon">
              {localProject ? (
                <CheckCircle2 size={18} />
              ) : (
                <XCircle size={18} />
              )}
            </div>
          </div>

          <div className="stat-value">
            {localProject ? "Ready" : "Waiting"}
          </div>

          <div className="stat-footer">
            {localProject
              ? "Project loaded"
              : "Select a project"}
          </div>
        </div>
      </div>

      {/* Project Browser */}
      <div className="terraform-section">
        <div className="terraform-section-header">
          <div>
            <h2 className="terraform-section-title">
              Local Terraform Project
            </h2>

            <p className="terraform-section-description">
              Select a Terraform directory from your
              local machine.
            </p>
          </div>

          {localProject && (
            <button
              className="terraform-project-button"
              onClick={handleClearProject}
            >
              <XCircle size={16} />
              Clear
            </button>
          )}
        </div>

        <TerraformProjectBrowser
          projectName={localProject?.name || ""}
          files={localFiles}
          selectedFile={selectedLocalFile?.name || ""}
          onBrowse={handleBrowseTerraformProject}
          onFileSelect={handleLocalFileSelect}
        />
      </div>

      {/* Error */}
      {planError && (
        <div className="terraform-selector-error">
          <XCircle size={16} />
          {planError}
        </div>
      )}

      {/* Code Viewer */}
      {selectedLocalFile && (
        <div className="terraform-section">
          <div className="terraform-section-header">
            <div>
              <h2 className="terraform-section-title">
                Terraform Configuration
              </h2>

              <p className="terraform-section-description">
                {selectedLocalFile.path}
              </p>
            </div>
          </div>

          <div className="terraform-code-viewer">
            <div className="terraform-code-viewer-header">
              <div className="terraform-code-file">
                <FileCode2 size={16} />

                <span>
                  {selectedLocalFile.name}
                </span>
              </div>
            </div>

            <pre className="terraform-code">
              <code>
                {selectedLocalFile.content}
              </code>
            </pre>
          </div>
        </div>
      )}

      {/* Terraform Actions */}
      {localProject && (
        <div className="terraform-section">
          <div className="terraform-section-header">
            <div>
              <h2 className="terraform-section-title">
                Terraform Actions
              </h2>

              <p className="terraform-section-description">
                Run Terraform operations against the
                selected project.
              </p>
            </div>
          </div>

          <div className="terraform-project-actions">
            <button
              className="terraform-project-button"
              onClick={handlePlan}
              disabled={planLoading}
            >
              <Play size={16} />

              {planLoading
                ? "Running..."
                : "Terraform Plan"}
            </button>
          </div>

          {planOutput && (
            <div className="terraform-plan-output">
              <div className="terraform-plan-header">
                <div className="terraform-plan-title-row">
                  <Terminal size={17} />

                  <span className="terraform-plan-title">
                    Terraform Output
                  </span>
                </div>
              </div>

              <div className="terraform-terminal">
                <div className="terraform-terminal-header">
                  <div className="terraform-terminal-dots">
                    <span />
                    <span />
                    <span />
                  </div>

                  <span className="terraform-terminal-title">
                    terraform
                  </span>
                </div>

                <pre className="terraform-terminal-output">
                  {planOutput}
                </pre>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Terraform;