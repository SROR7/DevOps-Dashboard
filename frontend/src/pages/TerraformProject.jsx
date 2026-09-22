import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

function TerraformProject() {
  const { projectName } = useParams();
  const navigate = useNavigate();

  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [resources, setResources] = useState([]);
  const [resourcesLoading, setResourcesLoading] = useState(true);
  const [resourcesError, setResourcesError] = useState("");

  const [stateResources, setStateResources] = useState([]);
  const [stateLoading, setStateLoading] = useState(true);
  const [stateError, setStateError] = useState("");
  const [hasState, setHasState] = useState(false);

  const [planLoading, setPlanLoading] = useState(false);
  const [planOutput, setPlanOutput] = useState("");
  const [planError, setPlanError] = useState("");

  const [initLoading, setInitLoading] = useState(false);
  const [initOutput, setInitOutput] = useState("");
  const [initError, setInitError] = useState("");

  const [validateLoading, setValidateLoading] =
    useState(false);

  const [validateOutput, setValidateOutput] =
    useState("");

  const [validateError, setValidateError] =
    useState("");

  const handleInit = async () => {
    try {
      setInitLoading(true);
      setInitOutput("");
      setInitError("");

      const response = await fetch(
        "http://localhost:3000/api/terraform/init",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            project: projectName,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message ||
            result.error ||
            "Terraform init failed"
        );
      }

      setInitOutput(result.output);
    } catch (err) {
      console.error(
        "Terraform Init Error:",
        err
      );

      setInitError(err.message);
    } finally {
      setInitLoading(false);
    }
  };

  const handleValidate = async () => {
    try {
      setValidateLoading(true);
      setValidateOutput("");
      setValidateError("");

      const response = await fetch(
        "http://localhost:3000/api/terraform/validate",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            project: projectName,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message ||
            result.error ||
            "Terraform validation failed"
        );
      }

      setValidateOutput(result.output);
    } catch (err) {
      console.error(
        "Terraform Validate Error:",
        err
      );

      setValidateError(err.message);
    } finally {
      setValidateLoading(false);
    }
  };

  const handlePlan = async () => {
    try {
      setPlanLoading(true);
      setPlanOutput("");
      setPlanError("");

      const response = await fetch(
        "http://localhost:3000/api/terraform/plan",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            project: projectName,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message ||
            result.error ||
            "Terraform plan failed"
        );
      }

      setPlanOutput(result.output);
    } catch (err) {
      console.error(
        "Terraform Plan Error:",
        err
      );

      setPlanError(err.message);
    } finally {
      setPlanLoading(false);
    }
  };

  useEffect(() => {
    const fetchProject = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `http://localhost:3000/api/terraform/projects/${encodeURIComponent(
            projectName
          )}`
        );

        const result = await response.json();

        if (!response.ok) {
          throw new Error(
            result.message ||
              "Failed to fetch Terraform project"
          );
        }

        setProject(result);
      } catch (err) {
        console.error(
          "Terraform Project Error:",
          err
        );

        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [projectName]);

  useEffect(() => {
    const fetchResources = async () => {
      try {
        setResourcesLoading(true);
        setResourcesError("");

        const response = await fetch(
          `http://localhost:3000/api/terraform/projects/${encodeURIComponent(
            projectName
          )}/resources`
        );

        const result = await response.json();

        if (!response.ok) {
          throw new Error(
            result.message ||
              "Failed to fetch Terraform resources"
          );
        }

        setResources(result.resources || []);
      } catch (err) {
        console.error(
          "Terraform Resources Error:",
          err
        );

        setResourcesError(err.message);
      } finally {
        setResourcesLoading(false);
      }
    };

    fetchResources();
  }, [projectName]);

  useEffect(() => {
    const fetchState = async () => {
      try {
        setStateLoading(true);
        setStateError("");

        const response = await fetch(
          `http://localhost:3000/api/terraform/projects/${encodeURIComponent(
            projectName
          )}/state`
        );

        const result = await response.json();

        if (!response.ok) {
          throw new Error(
            result.message ||
              "Failed to fetch Terraform state"
          );
        }

        setHasState(result.hasState);
        setStateResources(result.resources || []);
      } catch (err) {
        console.error(
          "Terraform State Error:",
          err
        );

        setStateError(err.message);
      } finally {
        setStateLoading(false);
      }
    };

    fetchState();
  }, [projectName]);

  if (loading) {
    return (
      <div className="page">
        <div className="terraform-empty-state">
          <h3>Loading project...</h3>

          <p>
            Fetching Terraform project details.
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page">
        <div className="terraform-empty-state">
          <h3>Failed to load project</h3>

          <p>{error}</p>

          <button
            className="terraform-project-button primary"
            onClick={() => navigate("/terraform")}
          >
            Back to Terraform
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <button
            className="terraform-back-button"
            onClick={() => navigate("/terraform")}
          >
            ← Back to Terraform
          </button>

          <h1>{project.name}</h1>

          <p>
            Manage and inspect your Terraform project.
          </p>
        </div>
      </div>

      <div className="terraform-project-details-grid">
        <div className="terraform-detail-card">
          <span className="terraform-detail-label">
            Project
          </span>

          <strong>{project.name}</strong>
        </div>

        <div className="terraform-detail-card">
          <span className="terraform-detail-label">
            Terraform Files
          </span>

          <strong>
            {project.terraformFiles.length}
          </strong>
        </div>

        <div className="terraform-detail-card">
          <span className="terraform-detail-label">
            Variables
          </span>

          <strong>
            {project.variableFiles.length}
          </strong>
        </div>

        <div className="terraform-detail-card">
          <span className="terraform-detail-label">
            Total Files
          </span>

          <strong>
            {project.files.length}
          </strong>
        </div>
      </div>

      <div className="terraform-project-info">
        <div>
          <span className="terraform-detail-label">
            Project Path
          </span>

          <code>{project.path}</code>
        </div>
      </div>

      <div className="terraform-project-files">
        <div className="terraform-section-header">
          <div>
            <h2>Project Files</h2>

            <p>
              Files detected inside this Terraform
              project.
            </p>
          </div>
        </div>

        <div className="terraform-file-list">
          {project.files.map((file) => (
            <div
              className="terraform-file-item"
              key={file}
            >
              <span className="terraform-file-icon">
                T
              </span>

              <span>{file}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="terraform-project-resources">
        <div className="terraform-section-header">
          <div>
            <h2>Terraform Resources</h2>

            <p>
              Resources detected in this Terraform
              project.
            </p>
          </div>

          {!resourcesLoading &&
            !resourcesError && (
              <span className="terraform-resource-count">
                {resources.length} resources
              </span>
            )}
        </div>

        {resourcesLoading && (
          <div className="terraform-resource-empty">
            Loading Terraform resources...
          </div>
        )}

        {resourcesError && (
          <div className="terraform-resource-error">
            {resourcesError}
          </div>
        )}

        {!resourcesLoading &&
          !resourcesError &&
          resources.length === 0 && (
            <div className="terraform-resource-empty">
              No Terraform resources found in this
              project.
            </div>
          )}

        {!resourcesLoading &&
          !resourcesError &&
          resources.length > 0 && (
            <div className="terraform-resource-list">
              {resources.map(
                (resource, index) => (
                  <div
                    className="terraform-resource-item"
                    key={`${resource.type}-${resource.name}-${index}`}
                  >
                    <div className="terraform-resource-icon">
                      T
                    </div>

                    <div className="terraform-resource-content">
                      <strong>
                        {resource.name}
                      </strong>

                      <span>
                        {resource.type}
                      </span>
                    </div>

                    <code>
                      {resource.file}
                    </code>
                  </div>
                )
              )}
            </div>
          )}
      </div>

      <div className="terraform-state-section">
        <div className="terraform-section-header">
          <div>
            <h2>Terraform State</h2>

            <p>
              Resources currently tracked by Terraform
              state.
            </p>
          </div>

          {!stateLoading &&
            !stateError && (
              <span
                className={`terraform-state-badge ${
                  hasState
                    ? "terraform-state-active"
                    : "terraform-state-empty"
                }`}
              >
                {hasState
                  ? "State Available"
                  : "No State"}
              </span>
            )}
        </div>

        {stateLoading && (
          <div className="terraform-state-empty">
            Loading Terraform state...
          </div>
        )}

        {stateError && (
          <div className="terraform-state-error">
            {stateError}
          </div>
        )}

        {!stateLoading &&
          !stateError &&
          !hasState && (
            <div className="terraform-state-empty">
              <strong>
                No Terraform state found
              </strong>

              <p>
                This project has not created a
                Terraform state file yet.
              </p>
            </div>
          )}

        {!stateLoading &&
          !stateError &&
          hasState &&
          stateResources.length === 0 && (
            <div className="terraform-state-empty">
              Terraform state exists, but no resources
              are currently tracked.
            </div>
          )}

        {!stateLoading &&
          !stateError &&
          hasState &&
          stateResources.length > 0 && (
            <div className="terraform-state-list">
              {stateResources.map(
                (resource, index) => (
                  <div
                    className="terraform-state-item"
                    key={`${resource}-${index}`}
                  >
                    <span className="terraform-state-icon">
                      T
                    </span>

                    <code>{resource}</code>
                  </div>
                )
              )}
            </div>
          )}
      </div>

      <div className="terraform-project-actions">
        <button
          className="terraform-project-button"
          onClick={handleInit}
          disabled={initLoading}
        >
          {initLoading
            ? "Initializing..."
            : "Init"}
        </button>

        <button
          className="terraform-project-button"
          onClick={handleValidate}
          disabled={validateLoading}
        >
          {validateLoading
            ? "Validating..."
            : "Validate"}
        </button>

        <button
          className="terraform-project-button primary"
          onClick={handlePlan}
          disabled={planLoading}
        >
          {planLoading
            ? "Planning..."
            : "Plan"}
        </button>
      </div>

      {initError && (
        <div className="terraform-empty-state">
          <h3>Terraform Init Failed</h3>

          <p>{initError}</p>
        </div>
      )}

      {initOutput && (
        <div className="terraform-plan-output">
          <div className="terraform-plan-header">
            <div className="terraform-plan-title-row">
              <div className="terraform-plan-icon">
                T
              </div>

              <div>
                <h2>Terraform Init</h2>

                <p>
                  Terraform project initialization
                </p>
              </div>
            </div>

            <div className="terraform-plan-status">
              <span className="terraform-status-dot"></span>
              Completed
            </div>
          </div>

          <div className="terraform-terminal">
            <div className="terraform-terminal-header">
              <div className="terraform-terminal-dots">
                <span></span>
                <span></span>
                <span></span>
              </div>

              <span className="terraform-terminal-title">
                terraform init
              </span>
            </div>

            <pre className="terraform-terminal-output">
              {initOutput}
            </pre>
          </div>
        </div>
      )}

      {validateError && (
        <div className="terraform-empty-state">
          <h3>
            Terraform Validation Failed
          </h3>

          <p>{validateError}</p>
        </div>
      )}

      {validateOutput && (
        <div className="terraform-validation-result">
          <div className="terraform-validation-header">
            <div>
              <h2>Terraform Validation</h2>

              <p>
                Configuration validation result
              </p>
            </div>

            <div className="terraform-plan-status">
              <span className="terraform-status-dot"></span>
              Valid
            </div>
          </div>

          <pre className="terraform-validation-output">
            {validateOutput}
          </pre>
        </div>
      )}

      {planError && (
        <div className="terraform-empty-state">
          <h3>Terraform Plan Failed</h3>

          <p>{planError}</p>
        </div>
      )}

      {planOutput && (
        <div className="terraform-plan-output">
          <div className="terraform-plan-header">
            <div className="terraform-plan-title-row">
              <div className="terraform-plan-icon">
                T
              </div>

              <div>
                <h2>Terraform Plan</h2>

                <p>
                  Infrastructure execution plan
                </p>
              </div>
            </div>

            <div className="terraform-plan-status">
              <span className="terraform-status-dot"></span>
              Completed
            </div>
          </div>

          <div className="terraform-terminal">
            <div className="terraform-terminal-header">
              <div className="terraform-terminal-dots">
                <span></span>
                <span></span>
                <span></span>
              </div>

              <span className="terraform-terminal-title">
                terraform plan
              </span>
            </div>

            <pre className="terraform-terminal-output">
              {planOutput}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}

export default TerraformProject;