import { useEffect, useState } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Sidebar from "./components/Sidebar";

import Github from "./pages/Github";
import Actions from "./pages/Actions";
import PullRequests from "./pages/PullRequests";
import Issues from "./pages/Issues";

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
            <span className="stat-title">
              Repositories
            </span>

            <div className="stat-icon">
              R
            </div>
          </div>

          <h2 className="stat-value">
            --
          </h2>

          <div className="stat-footer">
            GitHub repositories
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-title">
              Actions
            </span>

            <div className="stat-icon">
              A
            </div>
          </div>

          <h2 className="stat-value">
            --
          </h2>

          <div className="stat-footer">
            Workflow runs
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-title">
              Terraform
            </span>

            <div className="stat-icon">
              T
            </div>
          </div>

          <h2 className="stat-value">
            --
          </h2>

          <div className="stat-footer">
            Infrastructure
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-title">
              Kubernetes
            </span>

            <div className="stat-icon">
              K
            </div>
          </div>

          <h2 className="stat-value">
            --
          </h2>

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
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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

  useEffect(() => {
    fetchTerraformStatus();
  }, []);

  if (loading) {
    return (
      <section className="content">
        <div className="page-header">
          <h1 className="page-title">
            Terraform
          </h1>

          <p className="page-description">
            Manage your Terraform infrastructure.
          </p>
        </div>

        <div className="empty-state">
          <h3>
            Loading Terraform...
          </h3>

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
          onClick={fetchTerraformStatus}
        >
          Refresh
        </button>
      </div>

      {error ? (
        <div className="empty-state">
          <h3>
            Terraform unavailable
          </h3>

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

          <div className="section-header">
            <div>
              <h2 className="section-title">
                Terraform Environment
              </h2>

              <p className="card-subtitle">
                Terraform CLI information
              </p>
            </div>
          </div>

          <div className="card">
            <div className="ec2-instance-details">
              <div>
                <span>
                  Status
                </span>

                <strong>
                  {data?.installed
                    ? "Available"
                    : "Unavailable"}
                </strong>
              </div>

              <div>
                <span>
                  Version
                </span>

                <strong>
                  {data?.version || "-"}
                </strong>
              </div>

              <div>
                <span>
                  Executable
                </span>

                <strong>
                  {data?.path || "-"}
                </strong>
              </div>

              <div>
                <span>
                  Runtime
                </span>

                <strong>
                  Node.js Backend
                </strong>
              </div>
            </div>
          </div>
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
        <h3>
          Settings
        </h3>

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