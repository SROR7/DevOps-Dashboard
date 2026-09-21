import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Aws() {
  const navigate = useNavigate();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAwsOverview = async () => {
      try {
        const response = await fetch(
          "http://localhost:3000/api/aws/overview"
        );

        if (!response.ok) {
          throw new Error(`AWS API returned ${response.status}`);
        }

        const result = await response.json();
        setData(result);
      } catch (err) {
        console.error("Failed to fetch AWS overview:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAwsOverview();
  }, []);

  const openAwsConsole = (url) => {
    window.open(url, "_blank", "noopener,noreferrer");
  };

  if (loading) {
    return (
      <section className="content">
        <div className="page-header">
          <h1 className="page-title">AWS</h1>
          <p className="page-description">
            Manage and monitor your AWS infrastructure.
          </p>
        </div>

        <div className="empty-state">
          <h3>Loading AWS resources...</h3>
          <p>Fetching your AWS account information.</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="content">
        <div className="page-header">
          <h1 className="page-title">AWS</h1>
          <p className="page-description">
            Manage and monitor your AWS infrastructure.
          </p>
        </div>

        <div className="empty-state">
          <h3>Failed to load AWS data</h3>
          <p>{error}</p>
        </div>
      </section>
    );
  }

  const resources = [
    {
      name: "EC2",
      description: "Manage and monitor your EC2 instances.",
      count: data.ec2.total,
      label: "instances",
      icon: "E",
      path: "/aws/ec2",
      consoleUrl:
        "https://eu-north-1.console.aws.amazon.com/ec2/home?region=eu-north-1#Instances",
    },
    {
      name: "S3",
      description: "Manage your S3 buckets and storage.",
      count: data.s3.total,
      label: "buckets",
      icon: "S",
      path: "/aws/s3",
      consoleUrl:
        "https://s3.console.aws.amazon.com/s3/home?region=eu-north-1",
    },
    {
      name: "EKS",
      description: "Manage your Kubernetes clusters.",
      count: data.eks.total,
      label: "clusters",
      icon: "K",
      path: "/aws/eks",
      consoleUrl:
        "https://eu-north-1.console.aws.amazon.com/eks/home?region=eu-north-1#/clusters",
    },
    {
      name: "RDS",
      description: "Manage your relational databases.",
      count: data.rds.total,
      label: "databases",
      icon: "R",
      path: "/aws/rds",
      consoleUrl:
        "https://eu-north-1.console.aws.amazon.com/rds/home?region=eu-north-1#databases:",
    },
  ];

  return (
    <section className="content">
      <div className="page-header">
        <h1 className="page-title">AWS</h1>
        <p className="page-description">
          Manage and monitor your AWS infrastructure.
        </p>
      </div>

      <div className="card actions-repository-selector">
        <div className="card-header">
          <div>
            <h2 className="card-title">AWS Account</h2>
            <p className="card-subtitle">
              Connected AWS environment
            </p>
          </div>
        </div>

        <div className="repository-meta">
          <span>Account: {data.accountId}</span>
          <span>Region: {data.region}</span>
        </div>
      </div>

      <div className="section-header">
        <div>
          <h2 className="section-title">AWS Resources</h2>
          <p className="card-subtitle">
            Select a resource to view its details.
          </p>
        </div>
      </div>

      <div className="aws-resources-grid">
        {resources.map((resource) => (
          <div
            className="aws-resource-card"
            key={resource.name}
            onClick={() => navigate(resource.path)}
            role="button"
            tabIndex={0}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                navigate(resource.path);
              }
            }}
          >
            <div>
              <div className="aws-resource-icon">
                {resource.icon}
              </div>

              <div className="aws-resource-content">
                <h2>{resource.name}</h2>
                <p>{resource.description}</p>

                <div className="aws-resource-stats">
                  <strong>{resource.count}</strong>
                  <span>{resource.label}</span>
                </div>
              </div>
            </div>

            <button
              type="button"
              className="aws-console-button"
              onClick={(event) => {
                event.stopPropagation();
                openAwsConsole(resource.consoleUrl);
              }}
            >
              Open AWS Console
            </button>

            <div className="aws-resource-arrow">→</div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Aws;