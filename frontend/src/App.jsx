import { useEffect, useState } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useNavigate,
} from "react-router-dom";

import Sidebar from "./components/Sidebar";

import Github from "./pages/Github";
import Actions from "./pages/Actions";
import PullRequests from "./pages/PullRequests";
import Issues from "./pages/Issues";
import TerraformProject from "./pages/TerraformProject";

import Aws from "./pages/Aws";
import Ec2 from "./pages/Ec2";
import S3 from "./pages/S3";
import Eks from "./pages/Eks";
import Rds from "./pages/Rds";

import "./index.css";

function Dashboard() {
  return (
    <section className="content">
      <div className="page-header">
        <h1 className="page-title">Dashboard</h1>

        <p className="page-description">
          Manage your DevOps infrastructure and development workflow.
        </p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-title">Repositories</span>
            <div className="stat-icon">R</div>
          </div>

          <h2 className="stat-value">--</h2>

          <div className="stat-footer">
            GitHub repositories
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-title">Actions</span>
            <div className="stat-icon">A</div>
          </div>

          <h2 className="stat-value">--</h2>

          <div className="stat-footer">
            Workflow runs
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-title">Terraform</span>
            <div className="stat-icon">T</div>
          </div>

          <h2 className="stat-value">--</h2>

          <div className="stat-footer">
            Infrastructure
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-title">Kubernetes</span>
            <div className="stat-icon">K</div>
          </div>

          <h2 className="stat-value">--</h2>

          <div className="stat-footer">
            Cluster resources
          </div>
        </div>
      </div>

      <div className="dashboard-grid">
        <div className="card chart-card">
          <div className="card-header">
            <div>
              <h2 className="card-title">
                Infrastructure Activity
              </h2>

              <p className="card-subtitle">
                DevOps activity overview
              </p>
            </div>
          </div>

          <div className="chart">
            <div className="chart-grid"></div>
            <div className="chart-line"></div>
          </div>
        </div>

        <div className="card activity-card">
          <div className="card-header">
            <div>
              <h2 className="card-title">
                Recent Activity
              </h2>

              <p className="card-subtitle">
                Latest DevOps events
              </p>
            </div>
          </div>

          <div className="activity-list">
            <div className="activity-item">
              <div className="activity-dot"></div>

              <div>
                <p className="activity-title">
                  GitHub integration connected
                </p>

                <span className="activity-time">
                  Just now
                </span>
              </div>
            </div>

            <div className="activity-item">
              <div className="activity-dot"></div>

              <div>
                <p className="activity-title">
                  DevOps Dashboard initialized
                </p>

                <span className="activity-time">
                  Just now
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Terraform() {

  const navigate = useNavigate();

  const [data, setData] = useState(null);
  const [projects, setProjects] = useState([]);

  const [loading, setLoading] = useState(true);
  const [projectsLoading, setProjectsLoading] = useState(true);

  const [error, setError] = useState("");
  const [projectsError, setProjectsError] = useState("");

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

  const handleTerraformPlan = async (projectName) => {
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
                Terraform projects detected by the dashboard
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
              <h3>No Terraform projects found</h3>

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
                          planLoading === project.name
                        }
                      >
                        {planLoading === project.name
                          ? "Planning..."
                          : "Plan"}
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {planError && (
                <div className="terraform-empty-state">
                  <h3>Terraform Plan Failed</h3>

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

function Settings() {
  return (
    <section className="content">
      <div className="page-header">
        <h1 className="page-title">
          Settings
        </h1>

        <p className="page-description">
          Configure your DevOps Dashboard.
        </p>
      </div>

      <div className="empty-state">
        <h3>Settings</h3>

        <p>
          Dashboard settings will be available here.
        </p>
      </div>
    </section>
  );
}

function AppLayout() {
  return (
    <div className="app">
      <div className="app-layout">
        <Sidebar />

        <main className="main">
          <Routes>
            <Route
              path="/"
              element={<Dashboard />}
            />

            <Route
              path="/repositories"
              element={<Github />}
            />

            <Route
              path="/actions"
              element={<Actions />}
            />

            <Route
              path="/pull-requests"
              element={<PullRequests />}
            />

            <Route
              path="/issues"
              element={<Issues />}
            />

            <Route
              path="/aws"
              element={<Aws />}
            />

            <Route
              path="/aws/ec2"
              element={<Ec2 />}
            />

            <Route
              path="/aws/s3"
              element={<S3 />}
            />

            <Route
              path="/aws/eks"
              element={<Eks />}
            />

            <Route
              path="/aws/rds"
              element={<Rds />}
            />

            <Route
              path="/terraform"
              element={<Terraform />}
            />

            <Route
              path="/terraform/projects/:projectName"
              element={<TerraformProject />}
            />

            <Route
              path="/settings"
              element={<Settings />}
            />

            <Route
              path="*"
              element={
                <Navigate
                  to="/"
                  replace
                />
              }
            />
          </Routes>
        </main>
      </div>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppLayout />
    </BrowserRouter>
  );
}

export default App;