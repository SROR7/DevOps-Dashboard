import { useEffect, useState } from "react";

function Aws() {
  const [data, setData] = useState(null);
  const [instances, setInstances] = useState([]);
  const [buckets, setBuckets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAwsData = async () => {
      try {
        const [
          overviewResponse,
          ec2Response,
          s3Response,
        ] = await Promise.all([
          fetch(
            "http://localhost:3000/api/aws/overview"
          ),
          fetch(
            "http://localhost:3000/api/aws/ec2"
          ),
          fetch(
            "http://localhost:3000/api/aws/s3"
          ),
        ]);

        if (!overviewResponse.ok) {
          throw new Error(
            `AWS API returned ${overviewResponse.status}`
          );
        }

        if (!ec2Response.ok) {
          throw new Error(
            `EC2 API returned ${ec2Response.status}`
          );
        }

        if (!s3Response.ok) {
          throw new Error(
            `S3 API returned ${s3Response.status}`
          );
        }

        const overview =
          await overviewResponse.json();

        const ec2 =
          await ec2Response.json();

        const s3 =
          await s3Response.json();

        setData(overview);
        setInstances(ec2);
        setBuckets(s3);
      } catch (err) {
        console.error(
          "Failed to fetch AWS data:",
          err
        );

        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAwsData();
  }, []);

  if (loading) {
    return (
      <section className="content">
        <div className="page-header">
          <h1 className="page-title">
            AWS
          </h1>

          <p className="page-description">
            Monitor your AWS infrastructure.
          </p>
        </div>

        <div className="empty-state">
          <h3>Loading AWS resources...</h3>

          <p>
            Fetching data from AWS.
          </p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="content">
        <div className="page-header">
          <h1 className="page-title">
            AWS
          </h1>

          <p className="page-description">
            Monitor your AWS infrastructure.
          </p>
        </div>

        <div className="empty-state">
          <h3>Failed to load AWS data</h3>

          <p>{error}</p>
        </div>
      </section>
    );
  }

  return (
    <section className="content">
      <div className="page-header">
        <h1 className="page-title">
          AWS
        </h1>

        <p className="page-description">
          Monitor your AWS infrastructure.
        </p>
      </div>

      <div className="card actions-repository-selector">
        <div className="card-header">
          <div>
            <h2 className="card-title">
              AWS Account
            </h2>

            <p className="card-subtitle">
              Connected AWS environment
            </p>
          </div>
        </div>

        <div className="repository-meta">
          <span>
            Account: {data.accountId}
          </span>

          <span>
            Region: {data.region}
          </span>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-title">
              EC2
            </span>

            <div className="stat-icon">
              E
            </div>
          </div>

          <h2 className="stat-value">
            {data.ec2.total}
          </h2>

          <div className="stat-footer">
            {data.ec2.running} running ·{" "}
            {data.ec2.stopped} stopped
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-title">
              S3
            </span>

            <div className="stat-icon">
              S
            </div>
          </div>

          <h2 className="stat-value">
            {data.s3.total}
          </h2>

          <div className="stat-footer">
            S3 buckets
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-title">
              EKS
            </span>

            <div className="stat-icon">
              K
            </div>
          </div>

          <h2 className="stat-value">
            {data.eks.total}
          </h2>

          <div className="stat-footer">
            Kubernetes clusters
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-title">
              RDS
            </span>

            <div className="stat-icon">
              R
            </div>
          </div>

          <h2 className="stat-value">
            {data.rds.total}
          </h2>

          <div className="stat-footer">
            Database instances
          </div>
        </div>
      </div>

      <div className="section-header">
        <div>
          <h2 className="section-title">
            EC2 Instances
          </h2>

          <p className="card-subtitle">
            EC2 instances in {data.region}
          </p>
        </div>
      </div>

      {instances.length === 0 ? (
        <div className="empty-state">
          <h3>No EC2 instances found</h3>

          <p>
            There are no EC2 instances in this
            region.
          </p>
        </div>
      ) : (
        <div className="repositories-grid">
          {instances.map((instance) => (
            <div
              className="repository-card"
              key={instance.id}
            >
              <div className="repository-header">
                <div className="repository-name">
                  <div className="repository-icon">
                    E
                  </div>

                  <span>
                    {instance.name}
                  </span>
                </div>

                <span
                  className={`status-badge ${
                    instance.state === "running"
                      ? "status-success"
                      : instance.state === "stopped"
                      ? "status-warning"
                      : "status-info"
                  }`}
                >
                  {instance.state}
                </span>
              </div>

              <p className="repository-description">
                {instance.id}
              </p>

              <div className="repository-meta">
                <span>
                  Type: {instance.type}
                </span>

                <span>
                  AZ: {instance.availabilityZone}
                </span>
              </div>

              <div
                style={{
                  marginTop: "12px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "8px",
                }}
              >
                <span className="repository-meta">
                  Private IP:{" "}
                  {instance.privateIp}
                </span>

                <span className="repository-meta">
                  Public IP:{" "}
                  {instance.publicIp}
                </span>

                <span className="repository-meta">
                  AMI: {instance.ami}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="section-header">
        <div>
          <h2 className="section-title">
            S3 Buckets
          </h2>

          <p className="card-subtitle">
            S3 buckets available in your AWS
            account
          </p>
        </div>
      </div>

      {buckets.length === 0 ? (
        <div className="empty-state">
          <h3>No S3 buckets found</h3>

          <p>
            There are no S3 buckets in this
            AWS account.
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
                Amazon S3 bucket.
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

      <div className="section-header">
        <div>
          <h2 className="section-title">
            EKS Clusters
          </h2>

          <p className="card-subtitle">
            Kubernetes clusters in{" "}
            {data.region}
          </p>
        </div>
      </div>

      {data.eks.clusters.length === 0 ? (
        <div className="empty-state">
          <h3>No EKS clusters found</h3>

          <p>
            There are no EKS clusters in this
            region.
          </p>
        </div>
      ) : (
        <div className="repositories-grid">
          {data.eks.clusters.map(
            (cluster) => (
              <div
                className="repository-card"
                key={cluster}
              >
                <div className="repository-header">
                  <div className="repository-name">
                    <div className="repository-icon">
                      K
                    </div>

                    <span>
                      {cluster}
                    </span>
                  </div>

                  <span className="status-badge status-success">
                    EKS
                  </span>
                </div>

                <p className="repository-description">
                  Amazon Elastic Kubernetes
                  Service cluster.
                </p>
              </div>
            )
          )}
        </div>
      )}
    </section>
  );
}

export default Aws;