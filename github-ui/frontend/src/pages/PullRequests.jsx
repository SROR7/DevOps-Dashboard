import { useEffect, useState } from "react";

function PullRequests() {
  const [repositories, setRepositories] = useState([]);
  const [selectedRepo, setSelectedRepo] = useState("");
  const [pullRequests, setPullRequests] = useState([]);

  const [loadingRepos, setLoadingRepos] = useState(true);
  const [loadingPulls, setLoadingPulls] = useState(false);
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

    const fetchPullRequests = async () => {
      try {
        setLoadingPulls(true);
        setError("");

        const response = await fetch(
          `http://localhost:3000/api/github/pulls?repo=${encodeURIComponent(
            selectedRepo
          )}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch pull requests");
        }

        const data = await response.json();

        setPullRequests(data);
      } catch (err) {
        console.error(err);
        setError(err.message);
        setPullRequests([]);
      } finally {
        setLoadingPulls(false);
      }
    };

    fetchPullRequests();
  }, [selectedRepo]);

  const totalPullRequests = pullRequests.length;

  const openPullRequests = pullRequests.filter(
    (pull) => pull.state === "open"
  ).length;

  const closedPullRequests = pullRequests.filter(
    (pull) => pull.state === "closed"
  ).length;

  const mergedPullRequests = pullRequests.filter(
    (pull) => pull.merged_at !== null
  ).length;

  const getStatusClass = (pull) => {
    if (pull.merged_at) {
      return "status-info";
    }

    if (pull.state === "open") {
      return "status-success";
    }

    return "status-warning";
  };

  const getStatusText = (pull) => {
    if (pull.merged_at) {
      return "Merged";
    }

    if (pull.state === "open") {
      return "Open";
    }

    return "Closed";
  };

  if (loadingRepos) {
    return (
      <section className="content">
        <div className="page-header">
          <h1 className="page-title">Pull Requests</h1>

          <p className="page-description">
            Monitor pull requests across your GitHub repositories.
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
      <div className="page-header">
        <h1 className="page-title">Pull Requests</h1>

        <p className="page-description">
          Monitor pull requests across your GitHub repositories.
        </p>
      </div>

      {/* Repository Selector */}
      <div className="card actions-repository-selector">
        <div className="card-header">
          <div>
            <h2 className="card-title">Repository</h2>

            <p className="card-subtitle">
              Select a repository to view its pull requests.
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
            <span className="stat-title">Total</span>

            <div className="stat-icon">PR</div>
          </div>

          <h2 className="stat-value">
            {totalPullRequests}
          </h2>

          <div className="stat-footer">
            Pull requests
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-title">Open</span>

            <div className="stat-icon">○</div>
          </div>

          <h2 className="stat-value">
            {openPullRequests}
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
            {closedPullRequests}
          </h2>

          <div className="stat-footer">
            Closed pull requests
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-title">Merged</span>

            <div className="stat-icon">M</div>
          </div>

          <h2 className="stat-value">
            {mergedPullRequests}
          </h2>

          <div className="stat-footer">
            Successfully merged
          </div>
        </div>
      </div>

      {/* Pull Requests List */}
      <div className="section-header">
        <div>
          <h2 className="section-title">
            Pull Requests
          </h2>

          <p className="card-subtitle">
            {selectedRepo} · {totalPullRequests} pull requests
          </p>
        </div>
      </div>

      {error && (
        <div className="empty-state">
          <h3>Something went wrong</h3>
          <p>{error}</p>
        </div>
      )}

      {loadingPulls && (
        <div className="empty-state">
          <h3>Loading pull requests...</h3>

          <p>
            Fetching data from GitHub.
          </p>
        </div>
      )}

      {!loadingPulls &&
        !error &&
        pullRequests.length === 0 && (
          <div className="empty-state">
            <h3>No pull requests</h3>

            <p>
              This repository does not have any pull requests.
            </p>
          </div>
        )}

      {!loadingPulls &&
        !error &&
        pullRequests.length > 0 && (
          <div className="repositories-grid">
            {pullRequests.map((pull) => (
              <div
                className="repository-card"
                key={pull.id}
              >
                <div className="repository-header">
                  <div className="repository-name">
                    <div className="repository-icon">
                      PR
                    </div>

                    <span>
                      #{pull.number} {pull.title}
                    </span>
                  </div>

                  <span
                    className={`status-badge ${getStatusClass(
                      pull
                    )}`}
                  >
                    {getStatusText(pull)}
                  </span>
                </div>

                <p className="repository-description">
                  {pull.body ||
                    "No pull request description available."}
                </p>

                <div className="repository-footer">
                  <div className="repository-meta">
                    <span>
                      👤 {pull.user?.login || "Unknown"}
                    </span>

                    <span>
                      {pull.head?.ref || "Unknown"}
                      {" → "}
                      {pull.base?.ref || "Unknown"}
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
                    Updated{" "}
                    {new Date(
                      pull.updated_at
                    ).toLocaleString()}
                  </span>

                  <a
                    href={pull.html_url}
                    target="_blank"
                    rel="noreferrer"
                    className="view-all"
                  >
                    View PR →
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
    </section>
  );
}

export default PullRequests;