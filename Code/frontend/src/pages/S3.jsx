import { useEffect, useState } from "react";

function S3() {
  const [buckets, setBuckets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const region = "eu-north-1";

  useEffect(() => {
    const fetchBuckets = async () => {
      try {
        const response = await fetch(
          "http://localhost:3000/api/aws/s3"
        );

        if (!response.ok) {
          throw new Error(`S3 API returned ${response.status}`);
        }

        const data = await response.json();
        setBuckets(data);
      } catch (err) {
        console.error("Failed to fetch S3 buckets:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBuckets();
  }, []);

  const openAwsConsole = () => {
    window.open(
      `https://s3.console.aws.amazon.com/s3/home?region=${region}`,
      "_blank",
      "noopener,noreferrer"
    );
  };

  if (loading) {
    return (
      <section className="content">
        <div className="page-header">
          <h1 className="page-title">S3 Buckets</h1>
          <p className="page-description">
            Manage and monitor your Amazon S3 buckets.
          </p>
        </div>

        <div className="empty-state">
          <h3>Loading S3 buckets...</h3>
          <p>Fetching buckets from AWS.</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="content">
        <div className="page-header">
          <h1 className="page-title">S3 Buckets</h1>
          <p className="page-description">
            Manage and monitor your Amazon S3 buckets.
          </p>
        </div>

        <div className="empty-state">
          <h3>Failed to load S3 buckets</h3>
          <p>{error}</p>
        </div>
      </section>
    );
  }

  return (
    <section className="content">
      <div className="page-header">
        <div>
          <h1 className="page-title">S3 Buckets</h1>

          <p className="page-description">
            Manage and monitor your Amazon S3 buckets.
          </p>
        </div>

        <button
          className="aws-console-button"
          onClick={openAwsConsole}
        >
          Open AWS Console
        </button>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-title">Total</span>
            <div className="stat-icon">S</div>
          </div>

          <h2 className="stat-value">
            {buckets.length}
          </h2>

          <div className="stat-footer">
            S3 buckets
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-title">Storage</span>
            <div className="stat-icon">D</div>
          </div>

          <h2 className="stat-value">
            --
          </h2>

          <div className="stat-footer">
            Storage usage
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-title">Region</span>
            <div className="stat-icon">A</div>
          </div>

          <h2 className="stat-value">
            {region}
          </h2>

          <div className="stat-footer">
            AWS Region
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-title">Service</span>
            <div className="stat-icon">S</div>
          </div>

          <h2 className="stat-value">
            S3
          </h2>

          <div className="stat-footer">
            Simple Storage Service
          </div>
        </div>
      </div>

      <div className="section-header">
        <div>
          <h2 className="section-title">
            S3 Buckets
          </h2>

          <p className="card-subtitle">
            Buckets available in your AWS account
          </p>
        </div>
      </div>

      {buckets.length === 0 ? (
        <div className="empty-state">
          <h3>No S3 buckets found</h3>

          <p>
            There are no S3 buckets available in your AWS account.
          </p>
        </div>
      ) : (
        <div className="repositories-grid">
          {buckets.map((bucket) => (
            <div
              className="repository-card"
              key={bucket.name}
            >
              <div className="repository-header">
                <div className="repository-name">
                  <div className="repository-icon">
                    S
                  </div>

                  <span>
                    {bucket.name}
                  </span>
                </div>

                <span className="status-badge status-success">
                  S3
                </span>
              </div>

              <p className="repository-description">
                Amazon S3 storage bucket.
              </p>

              <div className="repository-meta">
                <span>
                  Created:{" "}
                  {bucket.creationDate
                    ? new Date(
                        bucket.creationDate
                      ).toLocaleDateString()
                    : "-"}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

export default S3;