import { useEffect, useState } from "react";

function Rds() {
  const [databases, setDatabases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const region = "eu-north-1";

  useEffect(() => {
    const fetchDatabases = async () => {
      try {
        const response = await fetch(
          "http://localhost:3000/api/aws/rds"
        );

        if (!response.ok) {
          throw new Error(`RDS API returned ${response.status}`);
        }

        const data = await response.json();
        setDatabases(data);
      } catch (err) {
        console.error("Failed to fetch RDS databases:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDatabases();
  }, []);

  const openAwsConsole = () => {
    window.open(
      `https://${region}.console.aws.amazon.com/rds/home?region=${region}#databases:`,
      "_blank",
      "noopener,noreferrer"
    );
  };

  const getStatusClass = (status) => {
    if (status === "available") {
      return "status-success";
    }

    if (
      status === "stopped" ||
      status === "stopping" ||
      status === "starting"
    ) {
      return "status-warning";
    }

    if (
      status === "failed" ||
      status === "inaccessible-encryption-credentials"
    ) {
      return "status-error";
    }

    return "status-info";
  };

  if (loading) {
    return (
      <section className="content">
        <div className="page-header">
          <h1 className="page-title">RDS Databases</h1>

          <p className="page-description">
            Manage and monitor your Amazon RDS databases.
          </p>
        </div>

        <div className="empty-state">
          <h3>Loading RDS databases...</h3>

          <p>Fetching databases from AWS.</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="content">
        <div className="page-header">
          <h1 className="page-title">RDS Databases</h1>

          <p className="page-description">
            Manage and monitor your Amazon RDS databases.
          </p>
        </div>

        <div className="empty-state">
          <h3>Failed to load RDS databases</h3>

          <p>{error}</p>
        </div>
      </section>
    );
  }

  const availableDatabases = databases.filter(
    (database) => database.status === "available"
  );

  const stoppedDatabases = databases.filter(
    (database) => database.status === "stopped"
  );

  return (
    <section className="content">
      <div className="page-header">
        <div>
          <h1 className="page-title">RDS Databases</h1>

          <p className="page-description">
            Manage and monitor your Amazon RDS databases.
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

            <div className="stat-icon">
              R
            </div>
          </div>

          <h2 className="stat-value">
            {databases.length}
          </h2>

          <div className="stat-footer">
            Database instances
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-title">Available</span>

            <div className="stat-icon">
              A
            </div>
          </div>

          <h2 className="stat-value">
            {availableDatabases.length}
          </h2>

          <div className="stat-footer">
            Available databases
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-title">Stopped</span>

            <div className="stat-icon">
              S
            </div>
          </div>

          <h2 className="stat-value">
            {stoppedDatabases.length}
          </h2>

          <div className="stat-footer">
            Stopped databases
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-title">Region</span>

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
            Database Instances
          </h2>

          <p className="card-subtitle">
            RDS databases in {region}
          </p>
        </div>
      </div>

      {databases.length === 0 ? (
        <div className="empty-state">
          <h3>No RDS databases found</h3>

          <p>
            There are no RDS database instances in {region}.
          </p>
        </div>
      ) : (
        <div className="repositories-grid">
          {databases.map((database) => (
            <div
              className="repository-card"
              key={database.id}
            >
              <div className="repository-header">
                <div className="repository-name">
                  <div className="repository-icon">
                    R
                  </div>

                  <span>
                    {database.id}
                  </span>
                </div>

                <span
                  className={`status-badge ${getStatusClass(
                    database.status
                  )}`}
                >
                  {database.status}
                </span>
              </div>

              <p className="repository-description">
                Amazon RDS database instance.
              </p>

              <div className="repository-meta">
                <span>
                  Engine: {database.engine || "-"}
                </span>

                <span>
                  Class: {database.instanceClass || "-"}
                </span>
              </div>

              <div className="ec2-instance-details">
                <div>
                  <span>Endpoint</span>

                  <strong>
                    {database.endpoint || "-"}
                  </strong>
                </div>

                <div>
                  <span>Port</span>

                  <strong>
                    {database.port || "-"}
                  </strong>
                </div>

                <div>
                  <span>Availability Zone</span>

                  <strong>
                    {database.availabilityZone || "-"}
                  </strong>
                </div>

                <div>
                  <span>Engine Version</span>

                  <strong>
                    {database.engineVersion || "-"}
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

export default Rds;