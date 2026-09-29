import { useState } from "react";
import { FolderOpen, FileCode2, X } from "lucide-react";

function TerraformProjectBrowser({
  files,
  projectName,
  onBrowse,
  onFileSelect,
  selectedFile,
}) {
  return (
    <div className="terraform-browser">
      <div className="terraform-browser-header">
        <div>
          <h3 className="terraform-browser-title">
            Terraform Project
          </h3>

          <p className="terraform-browser-description">
            Browse a Terraform project from your local machine.
          </p>
        </div>

        <button
          className="terraform-browse-button"
          onClick={onBrowse}
        >
          <FolderOpen size={17} />
          Browse
        </button>
      </div>

      {projectName ? (
        <div className="terraform-local-project">
          <div className="terraform-local-project-header">
            <div>
              <span className="terraform-local-project-label">
                Selected Project
              </span>

              <h4>{projectName}</h4>
            </div>

            <span className="terraform-file-count">
              {files.length} files
            </span>
          </div>

          <div className="terraform-local-files">
            {files.map((file) => (
              <button
                key={file.name}
                className={`terraform-local-file ${
                  selectedFile === file.name
                    ? "active"
                    : ""
                }`}
                onClick={() => onFileSelect(file)}
              >
                <FileCode2 size={16} />

                <span>{file.name}</span>
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="terraform-browser-empty">
          <FolderOpen size={32} />

          <h4>No Terraform project selected</h4>

          <p>
            Select a local folder containing your Terraform
            configuration files.
          </p>

          <button
            className="terraform-browse-empty-button"
            onClick={onBrowse}
          >
            <FolderOpen size={16} />
            Browse Local Folder
          </button>
        </div>
      )}
    </div>
  );
}

export default TerraformProjectBrowser;