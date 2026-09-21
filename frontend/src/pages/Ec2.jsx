import { useEffect, useState } from "react";

function Ec2() {
  const [instances, setInstances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const region = "eu-north-1";

  useEffect(() => {
    const fetchInstances = async () => {
      try {
        const response = await fetch(
          "http://localhost:3000/api/aws/ec2"
        );

        if (!response.ok) {
          throw new Error(`EC2 API returned ${response.status}`);
        }

        const data = await response.json();
        setInstances(data);
      } catch (err) {
        console.error("Failed to fetch EC2 instances:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchInstances();
  }, []);

  const openAwsConsole = () => {
    window.open(
      `https://${region}.console.aws.amazon.com/ec2/home?region=${region}#Instances`,
      "_blank",
      "noopener,noreferrer"
    );
  };

  const getStatusClass = (state) => {
    switch (state) {
      case "running":
        return "status-success";

      case "stopped":
        return "status-warning";

      case "terminated":
        return "status-error";

      default:
        return "status-info";
    }
  };

  if (loading) {
    return (
      <section className="content">
        <div className="page-header">
          <h1 className="page-title">EC2 Instances</h1>
          <p className="page-description">
            Manage and monitor your Amazon EC2 instances.
          </p>
        </div>

        <div className="empty-state">
          <h3>Loading EC2 instances...</h3>
          <p>Fetching instances from AWS.</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="content">
        <div className="page-header">
          <h1 className="page-title">EC2 Instances</h1>
          <p className="page-description">
            Manage and monitor your Amazon EC2 instances.
          </p>
        </div>

        <div className="empty-state">
          <h3>Failed to load EC2 instances</h3>
          <p>{error}</p>
        </div>
      </section>
    );
  }

  return (
    <section className="content">
      <div className="page-header">
        <div>
          <h1 className="page-title">EC2 Instances</h1>

          <p className="page-description">
            Manage and monitor your Amazon EC2 instances.
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
            <div className="stat-icon">E</div>
          </div>

          <h2 className="stat-value">
            {instances.length}
          </h2>

          <div className="stat-footer">
            EC2 instances
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-title">Running</span>
            <div className="stat-icon">R</div>
          </div>

          <h2 className="stat-value">
            {
              instances.filter(
                (instance) => instance.state === "running"
              ).length
            }
          </h2>

          <div className="stat-footer">
            Running instances
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-title">Stopped</span>
            <div className="stat-icon">S</div>
          </div>

          <h2 className="stat-value">
            {
              instances.filter(
                (instance) => instance.state === "stopped"
              ).length
            }
          </h2>

          <div className="stat-footer">
            Stopped instances
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
      </div>

      <div className="section-header">
        <div>
          <h2 className="section-title">
            EC2 Instances
          </h2>

          <p className="card-subtitle">
            Instances running in {region}
          </p>
        </div>
      </div>

      {instances.length === 0 ? (
        <div className="empty-state">
          <h3>No EC2 instances found</h3>

          <p>
            There are no EC2 instances in {region}.
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
                  className={`status-badge ${getStatusClass(
                    instance.state
                  )}`}
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

              <div className="ec2-instance-details">
                <div>
                  <span>Private IP</span>
                  <strong>
                    {instance.privateIp}
                  </strong>
                </div>

                <div>
                  <span>Public IP</span>
                  <strong>
                    {instance.publicIp}
                  </strong>
                </div>

                <div>
                  <span>AMI</span>
                  <strong>
                    {instance.ami}
                  </strong>
                </div>

                <div>
                  <span>Launch Time</span>
                  <strong>
                    {instance.launchTime
                      ? new Date(
                          instance.launchTime
                        ).toLocaleString()
                      : "-"}
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

export default Ec2;