import { useEffect, useState } from "react";

function TerraformFileTree({
  project,
  selectedFile,
  onFileSelect,
}) {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!project) {
      setFiles([]);
      setError("");
      return;
    }

    const fetchProjectFiles = async () => {
      try {
        setLoading(true);
        setError("");
        setFiles([]);

        const response = await fetch(
          `http:/api/terraform/projects/${encodeURIComponent(
            project
          )}`
        );

        const result = await response.json();

        if (!response.ok) {
          throw new Error(
            result.message ||
              "Failed to fetch Terraform project"
          );
        }

        setFiles(result.files || []);
      } catch (error) {
        console.error(
          "Terraform Project Files Error:",
          error
        );

        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProjectFiles();
  }, [project]);

  if (!project) {
    return (
      <div className="terraform-file-tree">
        <div className="terraform-file-tree-header">
          <span>Files</span>
        </div>

        <div className="terraform-file-tree-empty">
          <div className="terraform-file-empty-icon">
            TF
          </div>

          <p>Select a Terraform project</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="terraform-file-tree">
        <div className="terraform-file-tree-header">
          <span>Files</span>
        </div>

        <div className="terraform-file-tree-empty">
          <p>Loading files...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="terraform-file-tree">
        <div className="terraform-file-tree-header">
          <span>Files</span>
        </div>

        <div className="terraform-file-tree-empty">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  const terraformFiles = files.filter(
    (file) =>
      file.endsWith(".tf") ||
      file.endsWith(".tfvars") ||
      file.endsWith(".tfvars.json") ||
      file.endsWith(".auto.tfvars") ||
      file.endsWith(".auto.tfvars.json")
  );

  return (
    <div className="terraform-file-tree">
      <div className="terraform-file-tree-header">
        <div className="terraform-file-tree-title">
          <span>Files</span>
          <span className="terraform-file-count">
            {terraformFiles.length}
          </span>
        </div>
      </div>

      <div className="terraform-file-list">
        {terraformFiles.length === 0 ? (
          <div className="terraform-file-tree-empty">
            <p>No Terraform files found.</p>
          </div>
        ) : (
          terraformFiles.map((file) => (
            <button
              type="button"
              key={file}
              className={`terraform-file-item ${
                selectedFile === file ? "active" : ""
              }`}
              onClick={() => onFileSelect(file)}
            >
              <span className="terraform-file-icon">
                TF
              </span>

              <span className="terraform-file-name">
                {file}
              </span>
            </button>
          ))
        )}
      </div>
    </div>
  );
}

export default TerraformFileTree;