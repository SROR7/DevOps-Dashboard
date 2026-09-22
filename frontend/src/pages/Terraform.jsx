import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Terraform() {
  const navigate = useNavigate();

  const [data, setData] = useState(null);
  const [projects, setProjects] = useState([]);

  const [loading, setLoading] = useState(true);
  const [projectsLoading, setProjectsLoading] =
    useState(true);

  const [error, setError] = useState("");
  const [projectsError, setProjectsError] =
    useState("");

  const [planLoading, setPlanLoading] = useState("");
  const [planOutput, setPlanOutput] = useState("");
  const [planError, setPlanError] = useState("");

  const fetchTerraformStatus = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        "http://localhost:3000/api/terraform/status"
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message ||
            "Failed to fetch Terraform status"
        );
      }

      setData(result);
    } catch (err) {
      console.error(
        "Failed to fetch Terraform status:",
        err
      );

      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchTerraformProjects = async () => {
    try {
      setProjectsLoading(true);
      setProjectsError("");

      const response = await fetch(
        "http://localhost:3000/api/terraform/projects"
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message ||
            "Failed to fetch Terraform projects"
        );
      }

      setProjects(result);
    } catch (err) {
      console.error(
        "Failed to fetch Terraform projects:",
        err
      );

      setProjectsError(err.message);
    } finally {
      setProjectsLoading(false);
    }
  };

  const refreshTerraform = async () => {
    await Promise.all([
      fetchTerraformStatus(),
      fetchTerraformProjects(),
    ]);
  };

  const handleTerraformPlan = async (
    projectName
  ) => {
    try {
      setPlanLoading(projectName);
      setPlanOutput("");
      setPlanError("");

      const response = await fetch(
        "http://localhost:3000/api/terraform/plan",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            project: projectName,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message ||
            result.error ||
            "Terraform plan failed"
        );
      }

      setPlanOutput(result.output);
    } catch (err) {
      console.error(
        "Terraform Plan Error:",
        err
      );

      setPlanError(err.message);
    } finally {
      setPlanLoading("");
    }
  };

  useEffect(() => {
    refreshTerraform();
  }, []);

  if (loading) {
    return (
      <section className="content">
        <div className="page-header">
          <div>
            <h1 className="page-title">
              Terraform
            </h1>

            <p className="page-description">
              Manage your Terraform infrastructure.
            </p>
          </div>
        </div>

        <div className="terraform-empty-state">
          <h3>Loading Terraform...</h3>

          <p>
            Checking Terraform installation.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="content">
      <div className="page-header">
        <div>
          <h1 className="page-title">
            Terraform
          </h1>

          <p className="page-description">
            Manage your Terraform infrastructure.
          </p>
        </div>

        <button
          className="aws-console-button"
          onClick={refreshTerraform}
        >
          Refresh
        </button>
      </div>

      {error ? (
        <div className="terraform-empty-state">
          <h3>Terraform unavailable</h3>

          <p>{error}</p>
        </div>
      ) : (
        <>
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-header">
                <span className="stat-title">
                  Status
                </span>

                <div className="stat-icon">
                  T
                </div>
              </div>

              <h2 className="stat-value">
                {data?.installed
                  ? "Ready"
                  : "Unavailable"}
              </h2>

              <div className="stat-footer">
                Terraform CLI
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-header">
                <span className="stat-title">
                  Version
                </span>

                <div className="stat-icon">
                  V
                </div>
              </div>

              <h2 className="stat-value">
                {data?.version || "-"}
              </h2>

              <div className="stat-footer">
                Installed version
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-header">
                <span className="stat-title">
                  Provider
                </span>

                <div className="stat-icon">
                  P
                </div>
              </div>

              <h2 className="stat-value">
                Terraform
              </h2>

              <div className="stat-footer">
                Infrastructure as Code
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-header">
                <span className="stat-title">
                  Integration
                </span>

                <div className="stat-icon">
                  I
                </div>
              </div>

              <h2 className="stat-value">
                Connected
              </h2>

              <div className="stat-footer">
                Backend integration
              </div>
            </div>
          </div>

          <div className="terraform-section-header">
            <div>
              <h2 className="terraform-section-title">
                Terraform Environment
              </h2>

              <p className="terraform-section-description">
                Terraform CLI information
              </p>
            </div>
          </div>

          <div className="terraform-environment-card">
            <div className="terraform-environment-grid">
              <div className="terraform-environment-item">
                <span>Status</span>

                <strong>
                  {data?.installed
                    ? "Available"
                    : "Unavailable"}
                </strong>
              </div>

              <div className="terraform-environment-item">
                <span>Version</span>

                <strong>
                  {data?.version || "-"}
                </strong>
              </div>

              <div className="terraform-environment-item">
                <span>Executable</span>

                <strong>
                  {data?.path || "-"}
                </strong>
              </div>

              <div className="terraform-environment-item">
                <span>Runtime</span>

                <strong>
                  Node.js Backend
                </strong>
              </div>
            </div>
          </div>

          <div className="terraform-section-header">
            <div>
              <h2 className="terraform-section-title">
                Terraform Projects
              </h2>

              <p className="terraform-section-description">
                Terraform projects detected by the
                dashboard
              </p>
            </div>
          </div>

          {projectsLoading ? (
            <div className="terraform-empty-state">
              <h3>Loading projects...</h3>

              <p>
                Searching for Terraform projects.
              </p>
            </div>
          ) : projectsError ? (
            <div className="terraform-empty-state">
              <h3>Failed to load projects</h3>

              <p>{projectsError}</p>
            </div>
          ) : projects.length === 0 ? (
            <div className="terraform-empty-state">
              <h3>
                No Terraform projects found
              </h3>

              <p>
                Add a Terraform project containing
                .tf files to the configured projects
                directory.
              </p>
            </div>
          ) : (
            <>
              <div className="terraform-projects-grid">
                {projects.map((project) => (
                  <div
                    className="terraform-project-card"
                    key={project.path}
                  >
                    <div className="terraform-project-header">
                      <div className="terraform-project-title">
                        <div className="terraform-project-icon">
                          T
                        </div>

                        <div>
                          <h3>{project.name}</h3>

                          <span>
                            Terraform Project
                          </span>
                        </div>
                      </div>

                      <div className="terraform-status-badge">
                        <span className="terraform-status-dot"></span>
                        Ready
                      </div>
                    </div>

                    <div className="terraform-project-info">
                      <div className="terraform-info-row">
                        <span className="terraform-info-label">
                          Project Name
                        </span>

                        <div className="terraform-info-value">
                          {project.name}
                        </div>
                      </div>

                      <div className="terraform-info-row">
                        <span className="terraform-info-label">
                          Project Path
                        </span>

                        <div className="terraform-info-value">
                          {project.path}
                        </div>
                      </div>
                    </div>

                    <div className="terraform-project-actions">
                      <button
                        className="terraform-project-button"
                        onClick={() =>
                          navigate(
                            `/terraform/projects/${encodeURIComponent(
                              project.name
                            )}`
                          )
                        }
                      >
                        Open
                      </button>

                      <button
                        className="terraform-project-button primary"
                        onClick={() =>
                          handleTerraformPlan(
                            project.name
                          )
                        }
                        disabled={
                          planLoading ===
                          project.name
                        }
                      >
                        {planLoading ===
                        project.name
                          ? "Planning..."
                          : "Plan"}
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {planError && (
                <div className="terraform-empty-state">
                  <h3>
                    Terraform Plan Failed
                  </h3>

                  <p>{planError}</p>
                </div>
              )}

              {planOutput && (
                <div className="terraform-plan-output">
                  <div className="terraform-plan-header">
                    <div>
                      <div className="terraform-plan-title-row">
                        <div className="terraform-plan-icon">
                          T
                        </div>

                        <div>
                          <h2 className="terraform-section-title">
                            Terraform Plan
                          </h2>

                          <p className="terraform-section-description">
                            Latest execution result
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="terraform-plan-status">
                      <span className="terraform-status-dot"></span>
                      Completed
                    </div>
                  </div>

                  <div className="terraform-terminal">
                    <div className="terraform-terminal-header">
                      <div className="terraform-terminal-dots">
                        <span></span>
                        <span></span>
                        <span></span>
                      </div>

                      <span className="terraform-terminal-title">
                        terraform plan
                      </span>
                    </div>

                    <pre className="terraform-terminal-output">
                      {planOutput}
                    </pre>
                  </div>
                </div>
              )}
            </>
          )}
        </>
      )}
    </section>
  );
}

export default Terraform;
