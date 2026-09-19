import { useEffect, useState } from "react";

function Github() {
  const [repositories, setRepositories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchRepositories = async () => {
      try {
        const response = await fetch(
          "http://localhost:3000/api/github/repos"
        );

        if (!response.ok) {
          throw new Error(
            `GitHub API returned ${response.status}`
          );
        }

        const data = await response.json();

        setRepositories(data);
      } catch (err) {
        console.error("Failed to fetch repositories:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRepositories();
  }, []);

  if (loading) {
    return (
      <section className="content">
        <div className="page-header">
          <h1 className="page-title">GitHub</h1>
          <p className="page-description">
            Loading your GitHub repositories...
          </p>
        </div>

        <div className="empty-state">
          <h3>Loading repositories</h3>
          <p>Please wait while we fetch your GitHub data.</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="content">
        <div className="page-header">
          <h1 className="page-title">GitHub</h1>
          <p className="page-description">
            Manage your GitHub repositories and development workflow.
          </p>
        </div>

        <div className="empty-state">
          <h3>Failed to load repositories</h3>
          <p>{error}</p>
        </div>
      </section>
    );
  }

  return (
    <section className="content">
      <div className="page-header">
        <h1 className="page-title">GitHub</h1>

        <p className="page-description">
          Manage your GitHub repositories and development workflow.
        </p>
      </div>

      <div className="section-header">
        <div>
          <h2 className="section-title">Repositories</h2>

          <p className="card-subtitle">
            {repositories.length} repositories found
          </p>
        </div>
      </div>

      {repositories.length === 0 ? (
        <div className="empty-state">
          <h3>No repositories found</h3>
          <p>
            No GitHub repositories were returned from the API.
          </p>
        </div>
      ) : (
        <div className="repositories-grid">
          {repositories.map((repo) => (
            <div
              className="repository-card"
              key={repo.id}
            >
              <div className="repository-header">
                <div className="repository-name">
                  <div className="repository-icon">
                    {repo.private ? "🔒" : "📦"}
                  </div>

                  <span>{repo.name}</span>
                </div>

                <span
                  className={`status-badge ${
                    repo.private
                      ? "status-warning"
                      : "status-success"
                  }`}
                >
                  {repo.private ? "Private" : "Public"}
                </span>
              </div>

              <p className="repository-description">
                {repo.description || "No description available."}
              </p>

              <div className="repository-footer">
                <div className="repository-meta">
                  <span>
                    ⭐ {repo.stargazers_count}
                  </span>

                  <span>
                    🍴 {repo.forks_count}
                  </span>

                  <span>
                    {repo.language || "Unknown"}
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
                    repo.updated_at
                  ).toLocaleDateString()}
                </span>

                <a
                  href={repo.html_url}
                  target="_blank"
                  rel="noreferrer"
                  className="view-all"
                >
                  View →
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

export default Github;