import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

function TerraformProject() {
  const { projectName } = useParams();
  const navigate = useNavigate();

  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProject = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `http://localhost:3000/api/terraform/projects/${encodeURIComponent(
            projectName
          )}`
        );

        const result = await response.json();

        if (!response.ok) {
          throw new Error(
            result.message ||
              "Failed to fetch Terraform project"
          );
        }

        setProject(result);
      } catch (err) {
        console.error(
          "Terraform Project Error:",
          err
        );

        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [projectName]);

  if (loading) {
    return (
      <div className="page">
        <div className="terraform-empty-state">
          <h3>Loading project...</h3>
          <p>Fetching Terraform project details.</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page">
        <div className="terraform-empty-state">
          <h3>Failed to load project</h3>
          <p>{error}</p>

          <button
            className="terraform-project-button primary"
            onClick={() => navigate("/terraform")}
          >
            Back to Terraform
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      {/* Header */}
      <div className="page-header">
        <div>
          <button
            className="terraform-back-button"
            onClick={() => navigate("/terraform")}
          >
            ← Back to Terraform
          </button>

          <h1>{project.name}</h1>

          <p>
            Manage and inspect your Terraform project.
          </p>
        </div>
      </div>

      {/* Project information */}
      <div className="terraform-project-details-grid">

        <div className="terraform-detail-card">
          <span className="terraform-detail-label">
            Project
          </span>

          <strong>{project.name}</strong>
        </div>

        <div className="terraform-detail-card">
          <span className="terraform-detail-label">
            Terraform Files
          </span>

          <strong>
            {project.terraformFiles.length}
          </strong>
        </div>

        <div className="terraform-detail-card">
          <span className="terraform-detail-label">
            Variables
          </span>

          <strong>
            {project.variableFiles.length}
          </strong>
        </div>

        <div className="terraform-detail-card">
          <span className="terraform-detail-label">
            Total Files
          </span>

          <strong>
            {project.files.length}
          </strong>
        </div>

      </div>

      {/* Project path */}
      <div className="terraform-project-info">
        <div>
          <span className="terraform-detail-label">
            Project Path
          </span>

          <code>{project.path}</code>
        </div>
      </div>

      {/* Files */}
      <div className="terraform-project-files">
        <div className="terraform-section-header">
          <div>
            <h2>Project Files</h2>
            <p>
              Files detected inside this Terraform project.
            </p>
          </div>
        </div>

        <div className="terraform-file-list">
          {project.files.map((file) => (
            <div
              className="terraform-file-item"
              key={file}
            >
              <span className="terraform-file-icon">
                T
              </span>

              <span>{file}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="terraform-project-actions">
        <button className="terraform-project-button">
          Init
        </button>

        <button className="terraform-project-button">
          Validate
        </button>

        <button className="terraform-project-button primary">
          Plan
        </button>
      </div>
    </div>
  );
}

export default TerraformProject;