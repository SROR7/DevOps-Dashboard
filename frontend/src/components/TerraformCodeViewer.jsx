import { useEffect, useState } from "react";

function TerraformCodeViewer({
  project,
  file,
}) {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!project || !file) {
      setContent("");
      setError("");
      return;
    }

    const fetchTerraformFile = async () => {
      try {
        setLoading(true);
        setError("");
        setContent("");

        const response = await fetch(
          `http://localhost:3000/api/terraform/projects/${encodeURIComponent(
            project
          )}/files/${encodeURIComponent(file)}`
        );

        const result = await response.json();

        if (!response.ok) {
          throw new Error(
            result.message ||
              "Failed to fetch Terraform file"
          );
        }

        setContent(result.content || "");
      } catch (error) {
        console.error(
          "Terraform File Error:",
          error
        );

        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTerraformFile();
  }, [project, file]);

  if (!project || !file) {
    return (
      <div className="terraform-code-viewer terraform-code-empty">
        <div className="terraform-code-empty-icon">
          TF
        </div>

        <h3>Select a Terraform file</h3>

        <p>
          Choose a file from the project tree to view
          its Terraform configuration.
        </p>
      </div>
    );
  }

  return (
    <div className="terraform-code-viewer">
      <div className="terraform-code-header">
        <div className="terraform-code-file-info">
          <div className="terraform-code-title">
            {file}
          </div>

          <div className="terraform-code-project">
            {project}
          </div>
        </div>

        <div className="terraform-code-language">
          Terraform
        </div>
      </div>

      {loading && (
        <div className="terraform-code-loading">
          Loading {file}...
        </div>
      )}

      {error && (
        <div className="terraform-code-error">
          <div className="terraform-code-error-title">
            Failed to load file
          </div>

          <div className="terraform-code-error-message">
            {error}
          </div>
        </div>
      )}

      {!loading && !error && (
        <div className="terraform-code-container">
          <pre className="terraform-code-content">
            <code>{content}</code>
          </pre>
        </div>
      )}
    </div>
  );
}

export default TerraformCodeViewer;