import { useEffect, useState } from "react";

function Issues() {
  const [repositories, setRepositories] = useState([]);
  const [selectedRepo, setSelectedRepo] = useState("");
  const [issues, setIssues] = useState([]);

  const [loadingRepos, setLoadingRepos] = useState(true);
  const [loadingIssues, setLoadingIssues] = useState(false);
  const [error, setError] = useState("");

  // Fetch repositories
  useEffect(() => {
    const fetchRepositories = async () => {
      try {
        setLoadingRepos(true);
        setError("");

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
        console.error("Repositories error:", err);
        setError(err.message);
      } finally {
        setLoadingRepos(false);
      }
    };

    fetchRepositories();
  }, []);

  // Fetch issues
  useEffect(() => {
    if (!selectedRepo) {
      return;
    }

    const fetchIssues = async () => {
      try {
        setLoadingIssues(true);
        setError("");

        const response = await fetch(
          `http://localhost:3000/api/github/issues?repo=${encodeURIComponent(
            selectedRepo
          )}`
        );

        if (!response.ok) {
          throw new Error(
            `Failed to fetch GitHub Issues (${response.status})`
          );
        }

        const data = await response.json();

        setIssues(data);
      } catch (err) {
        console.error("Issues error:", err);
        setError(err.message);
        setIssues([]);
      } finally {
        setLoadingIssues(false);
      }
    };

    fetchIssues();
  }, [selectedRepo]);

  const totalIssues = issues.length;

  const openIssues = issues.filter(
    (issue) => issue.state === "open"
  ).length;

  const closedIssues = issues.filter(
    (issue) => issue.state === "closed"
  ).length;

  const totalLabels = issues.reduce(
    (total, issue) => total + (issue.labels?.length || 0),
    0
  );

  const getStatusClass = (issue) => {
    if (issue.state === "open") {
      return "status-success";
    }

    return "status-warning";
  };

  const getStatusText = (issue) => {
    if (issue.state === "open") {
      return "Open";
    }

    return "Closed";
  };

  // Loading repositories
  if (loadingRepos) {
    return (
      <section className="content">
        <div className="page-header">
          <h1 className="page-title">Issues</h1>

          <p className="page-description">
            Monitor issues across your GitHub repositories.
          </p>
        </div>

        <div className="empty-state">
          <h3>Loading repositories...</h3>
          <p>Please wait while we load your repositories.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="content">
      {/* Page Header */}
      <div className="page-header">
        <h1 className="page-title">Issues</h1>

        <p className="page-description">
          Monitor issues across your GitHub repositories.
        </p>
      </div>

      {/* Repository Selector */}
      <div className="card actions-repository-selector">
        <div className="card-header">
          <div>
            <h2 className="card-title">Repository</h2>

            <p className="card-subtitle">
              Select a repository to view its issues.
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

      {/* Stats */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-title">Total</span>

            <div className="stat-icon">I</div>
          </div>

          <h2 className="stat-value">
            {totalIssues}
          </h2>

          <div className="stat-footer">
            Total issues
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-title">Open</span>

            <div className="stat-icon">O</div>
          </div>

          <h2 className="stat-value">
            {openIssues}
          </h2>

          <div className="stat-footer">
            Currently open
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-title">Closed</span>

            <div className="stat-icon">✓</div>
          </div>

          <h2 className="stat-value">
            {closedIssues}
          </h2>

          <div className="stat-footer">
            Closed issues
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-title">Labels</span>

            <div className="stat-icon">#</div>
          </div>

          <h2 className="stat-value">
            {totalLabels}
          </h2>

          <div className="stat-footer">
            Issue labels
          </div>
        </div>
      </div>

      {/* Issues Header */}
      <div className="section-header">
        <div>
          <h2 className="section-title">
            Issues
          </h2>

          <p className="card-subtitle">
            {selectedRepo} · {totalIssues} issues
          </p>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="empty-state">
          <h3>Something went wrong</h3>

          <p>{error}</p>
        </div>
      )}

      {/* Loading */}
      {loadingIssues && !error && (
        <div className="empty-state">
          <h3>Loading issues...</h3>

          <p>
            Fetching data from GitHub.
          </p>
        </div>
      )}

      {/* No Issues */}
      {!loadingIssues &&
        !error &&
        issues.length === 0 && (
          <div className="empty-state">
            <h3>No issues found</h3>

            <p>
              This repository does not have any issues.
            </p>
          </div>
        )}

      {/* Issues List */}
      {!loadingIssues &&
        !error &&
        issues.length > 0 && (
          <div className="repositories-grid">
            {issues.map((issue) => (
              <div
                className="repository-card"
                key={issue.id}
              >
                {/* Issue Header */}
                <div className="repository-header">
                  <div className="repository-name">
                    <div className="repository-icon">
                      #
                    </div>

                    <span>
                      #{issue.number} {issue.title}
                    </span>
                  </div>

                  <span
                    className={`status-badge ${getStatusClass(
                      issue
                    )}`}
                  >
                    {getStatusText(issue)}
                  </span>
                </div>

                {/* Description */}
                <p className="repository-description">
                  {issue.body ||
                    "No issue description available."}
                </p>

                {/* Labels */}
                {issue.labels &&
                  issue.labels.length > 0 && (
                    <div
                      style={{
                        display: "flex",
                        gap: "8px",
                        flexWrap: "wrap",
                        marginTop: "12px",
                      }}
                    >
                      {issue.labels.map((label) => (
                        <span
                          key={label.id}
                          className="status-badge status-info"
                        >
                          {label.name}
                        </span>
                      ))}
                    </div>
                  )}

                {/* Footer */}
                <div className="repository-footer">
                  <div className="repository-meta">
                    <span>
                      👤{" "}
                      {issue.user?.login ||
                        "Unknown"}
                    </span>

                    <span>
                      💬 {issue.comments} comments
                    </span>
                  </div>
                </div>

                {/* Updated + Link */}
                <div
                  style={{
                    marginTop: "12px",
                    display: "flex",
                    justifyContent:
                      "space-between",
                    alignItems: "center",
                    gap: "16px",
                  }}
                >
                  <span className="repository-meta">
                    Updated{" "}
                    {new Date(
                      issue.updated_at
                    ).toLocaleString()}
                  </span>

                  <a
                    href={issue.html_url}
                    target="_blank"
                    rel="noreferrer"
                    className="view-all"
                  >
                    View Issue →
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
    </section>
  );
}

export default Issues;