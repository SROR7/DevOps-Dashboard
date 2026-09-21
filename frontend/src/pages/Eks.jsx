import { useEffect, useState } from "react";

function Eks() {
  const [clusters, setClusters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const region = "eu-north-1";

  useEffect(() => {
    const fetchClusters = async () => {
      try {
        const response = await fetch(
          "http://localhost:3000/api/aws/eks"
        );

        if (!response.ok) {
          throw new Error(
            `EKS API returned ${response.status}`
          );
        }

        const data = await response.json();

        setClusters(data);
      } catch (err) {
        console.error(
          "Failed to fetch EKS clusters:",
          err
        );

        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchClusters();
  }, []);

  const openAwsConsole = () => {
    window.open(
      `https://${region}.console.aws.amazon.com/eks/home?region=${region}#/clusters`,
      "_blank",
      "noopener,noreferrer"
    );
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "ACTIVE":
        return "status-success";

      case "CREATING":
      case "UPDATING":
      case "DELETING":
        return "status-warning";

      case "FAILED":
        return "status-error";

      default:
        return "status-info";
    }
  };

  const activeClusters = clusters.filter(
    (cluster) => cluster.status === "ACTIVE"
  );

  const failedClusters = clusters.filter(
    (cluster) => cluster.status === "FAILED"
  );

  if (loading) {
    return (
      <section className="content">
        <div className="page-header">
          <h1 className="page-title">
            EKS Clusters
          </h1>

          <p className="page-description">
            Manage and monitor your Amazon EKS clusters.
          </p>
        </div>

        <div className="empty-state">
          <h3>Loading EKS clusters...</h3>

          <p>
            Fetching clusters from AWS.
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
            EKS Clusters
          </h1>

          <p className="page-description">
            Manage and monitor your Amazon EKS clusters.
          </p>
        </div>

        <div className="empty-state">
          <h3>Failed to load EKS clusters</h3>

          <p>{error}</p>
        </div>
      </section>
    );
  }

  return (
    <section className="content">

      <div className="page-header">

        <div>
          <h1 className="page-title">
            EKS Clusters
          </h1>

          <p className="page-description">
            Manage and monitor your Amazon EKS clusters.
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
            <span className="stat-title">
              Total
            </span>

            <div className="stat-icon">
              K
            </div>
          </div>

          <h2 className="stat-value">
            {clusters.length}
          </h2>

          <div className="stat-footer">
            EKS clusters
          </div>

        </div>


        <div className="stat-card">

          <div className="stat-header">
            <span className="stat-title">
              Active
            </span>

            <div className="stat-icon">
              A
            </div>
          </div>

          <h2 className="stat-value">
            {activeClusters.length}
          </h2>

          <div className="stat-footer">
            Active clusters
          </div>

        </div>


        <div className="stat-card">

          <div className="stat-header">
            <span className="stat-title">
              Failed
            </span>

            <div className="stat-icon">
              F
            </div>
          </div>

          <h2 className="stat-value">
            {failedClusters.length}
          </h2>

          <div className="stat-footer">
            Failed clusters
          </div>

        </div>


        <div className="stat-card">

          <div className="stat-header">
            <span className="stat-title">
              Region
            </span>

            <div className="stat-icon">
              A
            </div>
          </div>

          <h2 className="stat-value">
            {region}
          </h2>

          <div className="stat-footer">
            AWS Region
          </div>

        </div>

      </div>


      <div className="section-header">

        <div>
          <h2 className="section-title">
            Kubernetes Clusters
          </h2>

          <p className="card-subtitle">
            EKS clusters in {region}
          </p>
        </div>

      </div>


      {clusters.length === 0 ? (

        <div className="empty-state">

          <h3>
            No EKS clusters found
          </h3>

          <p>
            There are no EKS clusters in {region}.
          </p>

        </div>

      ) : (

        <div className="repositories-grid">

          {clusters.map((cluster) => (

            <div
              className="repository-card"
              key={cluster.name}
            >

              <div className="repository-header">

                <div className="repository-name">

                  <div className="repository-icon">
                    K
                  </div>

                  <span>
                    {cluster.name}
                  </span>

                </div>


                <span
                  className={`status-badge ${getStatusClass(
                    cluster.status
                  )}`}
                >
                  {cluster.status}
                </span>

              </div>


              <p className="repository-description">
                Amazon Elastic Kubernetes Service cluster.
              </p>


              <div className="repository-meta">

                <span>
                  Region: {region}
                </span>

                <span>
                  Version: {cluster.version}
                </span>

              </div>


              <div className="ec2-instance-details">

                <div>
                  <span>
                    Kubernetes Version
                  </span>

                  <strong>
                    {cluster.version}
                  </strong>
                </div>


                <div>
                  <span>
                    Platform Version
                  </span>

                  <strong>
                    {cluster.platformVersion}
                  </strong>
                </div>


                <div>
                  <span>
                    Status
                  </span>

                  <strong>
                    {cluster.status}
                  </strong>
                </div>


                <div>
                  <span>
                    Created
                  </span>

                  <strong>
                    {cluster.createdAt
                      ? new Date(
                          cluster.createdAt
                        ).toLocaleString()
                      : "-"}
                  </strong>
                </div>


                <div>
                  <span>
                    Endpoint
                  </span>

                  <strong>
                    {cluster.endpoint || "-"}
                  </strong>
                </div>


                <div>
                  <span>
                    ARN
                  </span>

                  <strong>
                    {cluster.arn || "-"}
                  </strong>
                </div>

              </div>

            </div>

          ))}

        </div>

      )}

    </section>
  );
}

export default Eks;