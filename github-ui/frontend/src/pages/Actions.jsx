import { useEffect, useState } from "react";

function Actions() {
  const [repositories, setRepositories] = useState([]);
  const [selectedRepo, setSelectedRepo] = useState("");
  const [actions, setActions] = useState([]);

  const [loadingRepos, setLoadingRepos] = useState(true);
  const [loadingActions, setLoadingActions] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchRepositories = async () => {
      try {
        const response = await fetch(
          "http://localhost:3000/api/github/repos"
        );

        if (!response.ok) {
          throw new Error("Failed to fetch repositories");
        }

        const data = await response.json();

        setRepositories(data);

        if (data.length > 0) {
          setSelectedRepo(data[0].name);
        }
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoadingRepos(false);
      }
    };

    fetchRepositories();
  }, []);

  useEffect(() => {
    if (!selectedRepo) {
      return;
    }

    const fetchActions = async () => {
      try {
        setLoadingActions(true);
        setError("");

        const response = await fetch(
          `http://localhost:3000/api/github/actions?repo=${encodeURIComponent(
            selectedRepo
          )}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch GitHub Actions");
        }

        const data = await response.json();

        setActions(data);
      } catch (err) {
        console.error(err);
        setError(err.message);
        setActions([]);
      } finally {
        setLoadingActions(false);
      }
    };

    fetchActions();
  }, [selectedRepo]);

  const totalRuns = actions.length;

  const successfulRuns = actions.filter(
    (run) => run.conclusion === "success"
  ).length;

  const failedRuns = actions.filter(
    (run) => run.conclusion === "failure"
  ).length;

  const runningRuns = actions.filter(
    (run) => run.status !== "completed"
  ).length;

  const getStatusClass = (run) => {
    if (run.status !== "completed") {
      return "status-warning";
    }

    if (run.conclusion === "success") {
      return "status-success";
    }

    if (run.conclusion === "failure") {
      return "status-danger";
    }

    return "status-info";
  };

  const getStatusText = (run) => {
    if (run.status !== "completed") {
      return "Running";
    }

    if (run.conclusion === "success") {
      return "Success";
    }

    if (run.conclusion === "failure") {
      return "Failed";
    }

    return run.conclusion || "Unknown";
  };

  if (loadingRepos) {
    return (
      <section className="content">
        <div className="page-header">
          <h1 className="page-title">GitHub Actions</h1>

          <p className="page-description">
            Monitor your CI/CD workflows and deployments.
          </p>
        </div>

        <div className="empty-state">
          <h3>Loading repositories...</h3>

          <p>
            Please wait while we load your GitHub repositories.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="content">
      <div className="page-header">
        <h1 className="page-title">GitHub Actions</h1>

        <p className="page-description">
          Monitor your CI/CD workflows and deployments.
        </p>
      </div>

      {/* Repository Selector */}
      <div className="card actions-repository-selector">
        <div className="card-header">
          <div>
            <h2 className="card-title">Repository</h2>

            <p className="card-subtitle">
              Select a repository to view its workflow activity.
            </p>
          </div>
        </div>

        <select
          value={selectedRepo}
          onChange={(e) => setSelectedRepo(e.target.value)}
          className="input"
        >
          {repositories.map((repo) => (
            <option key={repo.id} value={repo.name}>
              {repo.name}
            </option>
          ))}
        </select>
      </div>

      {/* Statistics */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-title">Total Runs</span>

            <div className="stat-icon">R</div>
          </div>

          <h2 className="stat-value">
            {totalRuns}
          </h2>

          <div className="stat-footer">
            Workflow executions
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-title">Successful</span>

            <div className="stat-icon">✓</div>
          </div>

          <h2 className="stat-value">
            {successfulRuns}
          </h2>

          <div className="stat-footer">
            Successful workflow runs
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-title">Failed</span>

            <div className="stat-icon">!</div>
          </div>

          <h2 className="stat-value">
            {failedRuns}
          </h2>

          <div className="stat-footer">
            Failed workflow runs
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-title">Running</span>

            <div className="stat-icon">↻</div>
          </div>

          <h2 className="stat-value">
            {runningRuns}
          </h2>

          <div className="stat-footer">
            Active workflow runs
          </div>
        </div>
      </div>

      {/* Workflow Runs */}
      <div className="section-header">
        <div>
          <h2 className="section-title">
            Workflow Runs
          </h2>

          <p className="card-subtitle">
            {selectedRepo} · {totalRuns} runs
          </p>
        </div>
      </div>

      {error && (
        <div className="empty-state">
          <h3>Something went wrong</h3>

          <p>{error}</p>
        </div>
      )}

      {loadingActions && (
        <div className="empty-state">
          <h3>Loading workflow runs...</h3>

          <p>
            Fetching data from GitHub.
          </p>
        </div>
      )}

      {!loadingActions &&
        !error &&
        actions.length === 0 && (
          <div className="empty-state">
            <h3>No workflow runs</h3>

            <p>
              This repository does not have any GitHub Actions
              runs yet.
            </p>
          </div>
        )}

      {!loadingActions &&
        !error &&
        actions.length > 0 && (
          <div className="repositories-grid">
            {actions.map((run) => (
              <div
                className="repository-card"
                key={run.id}
              >
                <div className="repository-header">
                  <div className="repository-name">
                    <div className="repository-icon">
                      ⚙
                    </div>

                    <span>{run.name}</span>
                  </div>

                  <span
                    className={`status-badge ${getStatusClass(
                      run
                    )}`}
                  >
                    {getStatusText(run)}
                  </span>
                </div>

                <p className="repository-description">
                  {run.head_commit?.message ||
                    "No commit message available."}
                </p>

                <div className="repository-footer">
                  <div className="repository-meta">
                    <span>
                      Branch:{" "}
                      {run.head_branch || "Unknown"}
                    </span>

                    <span>
                      Event:{" "}
                      {run.event || "Unknown"}
                    </span>
                  </div>
                </div>

                <div
                  style={{
                    marginTop: "12px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <span className="repository-meta">
                    {new Date(
                      run.created_at
                    ).toLocaleString()}
                  </span>

                  <a
                    href={run.html_url}
                    target="_blank"
                    rel="noreferrer"
                    className="view-all"
                  >
                    View Run →
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
    </section>
  );
}

export default Actions;