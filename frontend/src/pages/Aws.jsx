import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Aws() {
  const navigate = useNavigate();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const region = "eu-north-1";

  useEffect(() => {
    const fetchAwsOverview = async () => {
      try {
        const response = await fetch(
          "http://localhost:3000/api/aws/overview"
        );

        if (!response.ok) {
          throw new Error(
            `AWS API returned ${response.status}`
          );
        }

        const result = await response.json();

        setData(result);
      } catch (err) {
        console.error(
          "Failed to fetch AWS overview:",
          err
        );

        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAwsOverview();
  }, []);

  const openAwsConsole = (url) => {
    window.open(
      url,
      "_blank",
      "noopener,noreferrer"
    );
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

          <p>
            Fetching your AWS account information.
          </p>
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
      description:
        "Manage and monitor your EC2 instances.",
      count: data.ec2?.total || 0,
      label: "instances",
      icon: "E",
      path: "/aws/ec2",
      consoleUrl:
        `https://${region}.console.aws.amazon.com/ec2/home?region=${region}#Instances`,
    },

    {
      name: "S3",
      description:
        "Manage your S3 buckets and storage.",
      count: data.s3?.total || 0,
      label: "buckets",
      icon: "S",
      path: "/aws/s3",
      consoleUrl:
        `https://s3.console.aws.amazon.com/s3/home?region=${region}`,
    },

    {
      name: "EKS",
      description:
        "Manage your Kubernetes clusters.",
      count: data.eks?.total || 0,
      label: "clusters",
      icon: "K",
      path: "/aws/eks",
      consoleUrl:
        `https://${region}.console.aws.amazon.com/eks/home?region=${region}#/clusters`,
    },

    {
      name: "RDS",
      description:
        "Manage your relational databases.",
      count: data.rds?.total || 0,
      label: "databases",
      icon: "R",
      path: "/aws/rds",
      consoleUrl:
        `https://${region}.console.aws.amazon.com/rds/home?region=${region}#databases:`,
    },
  ];

  return (
    <section className="content">

      {/* Page Header */}

      <div className="page-header">
        <div>
          <h1 className="page-title">
            AWS
          </h1>

          <p className="page-description">
            Manage and monitor your AWS infrastructure.
          </p>
        </div>
      </div>


      {/* AWS Account */}

      <div className="aws-account-card">

        <div className="aws-account-header">

          <div className="aws-account-icon">
            AWS
          </div>

          <div>
            <h2>
              AWS Account
            </h2>

            <p>
              Connected AWS environment
            </p>
          </div>

          <span className="aws-connected-badge">
            ● Connected
          </span>

        </div>


        <div className="aws-account-details">

          <div className="aws-account-detail">

            <span className="aws-detail-label">
              Account ID
            </span>

            <strong>
              {data.accountId || "-"}
            </strong>

          </div>


          <div className="aws-account-detail">

            <span className="aws-detail-label">
              Region
            </span>

            <strong>
              {data.region || region}
            </strong>

          </div>

        </div>

      </div>


      {/* Overview */}

      <div className="section-header">

        <div>
          <h2 className="section-title">
            Overview
          </h2>

          <p className="card-subtitle">
            Current AWS infrastructure summary
          </p>
        </div>

      </div>


      <div className="stats-grid">

        {/* EC2 */}

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
            {data.ec2?.total || 0}
          </h2>

          <div className="stat-footer">
            {data.ec2?.running || 0} running ·{" "}
            {data.ec2?.stopped || 0} stopped
          </div>

        </div>


        {/* S3 */}

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
            {data.s3?.total || 0}
          </h2>

          <div className="stat-footer">
            S3 buckets
          </div>

        </div>


        {/* EKS */}

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
            {data.eks?.total || 0}
          </h2>

          <div className="stat-footer">
            Kubernetes clusters
          </div>

        </div>


        {/* RDS */}

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
            {data.rds?.total || 0}
          </h2>

          <div className="stat-footer">
            Database instances
          </div>

        </div>

      </div>


      {/* AWS Resources */}

      <div className="section-header">

        <div>
          <h2 className="section-title">
            AWS Resources
          </h2>

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
            onClick={() =>
              navigate(resource.path)
            }
            role="button"
            tabIndex={0}
            onKeyDown={(event) => {

              if (
                event.key === "Enter" ||
                event.key === " "
              ) {
                navigate(resource.path);
              }

            }}
          >

            <div>

              <div className="aws-resource-icon">
                {resource.icon}
              </div>


              <div className="aws-resource-content">

                <h2>
                  {resource.name}
                </h2>

                <p>
                  {resource.description}
                </p>


                <div className="aws-resource-stats">

                  <strong>
                    {resource.count}
                  </strong>

                  <span>
                    {resource.label}
                  </span>

                </div>

              </div>

            </div>


            {/* AWS Console Button */}

            <button
              type="button"
              className="aws-console-button"
              onClick={(event) => {

                event.stopPropagation();

                openAwsConsole(
                  resource.consoleUrl
                );

              }}
            >
              Open AWS Console
            </button>


            {/* Arrow */}

            <div className="aws-resource-arrow">
              →
            </div>

          </div>

        ))}

      </div>

    </section>
  );
}

export default Aws;