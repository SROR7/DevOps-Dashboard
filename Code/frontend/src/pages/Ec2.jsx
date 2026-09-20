import { useEffect, useState } from "react";

function Ec2() {
  const [instances, setInstances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("http://localhost:3000/api/aws/ec2")
      .then((response) => {
        if (!response.ok) {
          throw new Error(`API returned ${response.status}`);
        }

        return response.json();
      })
      .then((data) => {
        setInstances(data);
      })
      .catch((err) => {
        console.error(err);
        setError(err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const total = instances.length;

  const running = instances.filter(
    (instance) => instance.state === "running"
  ).length;

  const stopped = instances.filter(
    (instance) => instance.state === "stopped"
  ).length;

  if (loading) {
    return (
      <section className="content">
        <div className="page-header">
          <h1 className="page-title">EC2</h1>

          <p className="page-description">
            Manage and monitor your EC2 instances.
          </p>
        </div>

        <div className="empty-state">
          <h3>Loading EC2 instances...</h3>

          <p>Fetching data from AWS.</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="content">
        <div className="page-header">
          <h1 className="page-title">EC2</h1>

          <p className="page-description">
            Manage and monitor your EC2 instances.
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
        <h1 className="page-title">EC2</h1>

        <p className="page-description">
          Manage and monitor your EC2 instances.
        </p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-title">Total</span>
            <div className="stat-icon">E</div>
          </div>

          <h2 className="stat-value">{total}</h2>

          <div className="stat-footer">
            EC2 instances
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-title">Running</span>
            <div className="stat-icon">R</div>
          </div>

          <h2 className="stat-value">{running}</h2>

          <div className="stat-footer">
            Running instances
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-title">Stopped</span>
            <div className="stat-icon">S</div>
          </div>

          <h2 className="stat-value">{stopped}</h2>

          <div className="stat-footer">
            Stopped instances
          </div>
        </div>
      </div>

      <div className="section-header">
        <div>
          <h2 className="section-title">
            EC2 Instances
          </h2>

          <p className="card-subtitle">
            Instances in your AWS region
          </p>
        </div>
      </div>

      {instances.length === 0 ? (
        <div className="empty-state">
          <h3>No EC2 instances found</h3>

          <p>
            There are no EC2 instances in this region.
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

                  <span>{instance.name}</span>
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
                  Private IP: {instance.privateIp}
                </span>

                <span className="repository-meta">
                  Public IP: {instance.publicIp}
                </span>

                <span className="repository-meta">
                  AMI: {instance.ami}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

export default Ec2;