import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

function TerraformProject() {
  const { projectName } = useParams();
  const navigate = useNavigate();

  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [resources, setResources] = useState([]);
  const [resourcesLoading, setResourcesLoading] =
    useState(true);
  const [resourcesError, setResourcesError] =
    useState("");

  const [stateResources, setStateResources] =
    useState([]);
  const [stateLoading, setStateLoading] =
    useState(true);
  const [stateError, setStateError] = useState("");
  const [hasState, setHasState] = useState(false);

  const [comparison, setComparison] = useState(null);
  const [comparisonLoading, setComparisonLoading] =
    useState(true);
  const [comparisonError, setComparisonError] =
    useState("");

  const [planLoading, setPlanLoading] =
    useState(false);
  const [planOutput, setPlanOutput] = useState("");
  const [planError, setPlanError] = useState("");

  const [initLoading, setInitLoading] =
    useState(false);
  const [initOutput, setInitOutput] = useState("");
  const [initError, setInitError] = useState("");

  const [validateLoading, setValidateLoading] =
    useState(false);
  const [validateOutput, setValidateOutput] =
    useState("");
  const [validateError, setValidateError] =
    useState("");

  const [applyLoading, setApplyLoading] =
    useState(false);
  const [applyOutput, setApplyOutput] = useState("");
  const [applyError, setApplyError] = useState("");

  const operationLoading =
    initLoading ||
    validateLoading ||
    planLoading ||
    applyLoading;

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

  const fetchComparison = async () => {
    try {
      setComparisonLoading(true);
      setComparisonError("");

      const response = await fetch(
        `http://localhost:3000/api/terraform/projects/${encodeURIComponent(
          projectName
        )}/compare`
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message ||
            "Failed to compare Terraform state"
        );
      }

      setComparison(result);
    } catch (err) {
      console.error(
        "Terraform Comparison Error:",
        err
      );

      setComparisonError(err.message);
    } finally {
      setComparisonLoading(false);
    }
  };

  const handleRefreshState = async () => {
    await Promise.all([
      fetchState(),
      fetchComparison(),
    ]);
  };

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

      await handleRefreshState();
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

      await handleRefreshState();
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

  const handleApply = async () => {
    const confirmed = window.confirm(
      `Are you sure you want to apply Terraform changes to "${projectName}"?`
    );

    if (!confirmed) {
      return;
    }

    try {
      setApplyLoading(true);
      setApplyOutput("");
      setApplyError("");

      const response = await fetch(
        "http://localhost:3000/api/terraform/apply",
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
            "Terraform apply failed"
        );
      }

      setApplyOutput(result.output);

      await handleRefreshState();
    } catch (err) {
      console.error(
        "Terraform Apply Error:",
        err
      );

      setApplyError(err.message);
    } finally {
      setApplyLoading(false);
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
    fetchState();
  }, [projectName]);

  useEffect(() => {
    fetchComparison();
  }, [projectName]);

  if (loading) {
    return (
      <div className="terraform-project-page">
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
      <div className="terraform-project-page">
        <div className="terraform-empty-state">
          <h3>Failed to load project</h3>

          <p>{error}</p>

          <button
            className="terraform-project-button primary"
            onClick={() =>
              navigate("/terraform")
            }
          >
            Back to Terraform
          </button>
        </div>
      </div>
    );
  }

  const matchedCount =
    comparison?.comparison?.matched?.total || 0;

  const missingCount =
    comparison?.comparison?.missingFromState
      ?.total || 0;

  const unmanagedCount =
    comparison?.comparison?.unmanagedResources
      ?.total || 0;

  const configurationCount =
    comparison?.configuration?.total || 0;

  const stateCount =
    comparison?.state?.total || 0;

  const hasDrift =
    missingCount > 0 || unmanagedCount > 0;

  return (
    <div className="terraform-project-page">
      <div className="terraform-project-header">
        <button
          className="terraform-back-button"
          onClick={() => navigate("/terraform")}
        >
          <span className="terraform-back-arrow">←</span>
          <span>Back to Terraform</span>
        </button>

        <div className="terraform-project-heading">
          <h1>{project.name}</h1>
          <p>
            Manage and inspect your Terraform infrastructure.
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

          <div className="terraform-state-actions">
            {!stateLoading &&
              !stateError && (
                <span
                  className={`terraform-state-badge ${
                    hasState
                      ? "terraform-state-active"
                      : "terraform-state-no-state"
                  }`}
                >
                  {hasState
                    ? "State Available"
                    : "No State"}
                </span>
              )}

            <button
              className="terraform-state-refresh"
              onClick={handleRefreshState}
              disabled={
                stateLoading ||
                comparisonLoading ||
                operationLoading
              }
            >
              {stateLoading ||
              comparisonLoading
                ? "Refreshing..."
                : "↻ Refresh"}
            </button>
          </div>
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

                    <span className="terraform-state-resource-status">
                      TRACKED
                    </span>
                  </div>
                )
              )}
            </div>
          )}
      </div>

      <div className="terraform-drift-section">
        <div className="terraform-section-header">
          <div>
            <h2>Drift Detection</h2>

            <p>
              Compare Terraform configuration with the
              current state.
            </p>
          </div>

          {!comparisonLoading &&
            !comparisonError && (
              <span
                className={`terraform-drift-badge ${
                  hasDrift
                    ? "terraform-drift-detected"
                    : "terraform-no-drift"
                }`}
              >
                {hasDrift
                  ? "Drift Detected"
                  : "No Drift"}
              </span>
            )}
        </div>

        {comparisonLoading && (
          <div className="terraform-drift-empty">
            Checking Terraform configuration and state...
          </div>
        )}

        {comparisonError && (
          <div className="terraform-drift-error">
            {comparisonError}
          </div>
        )}

        {!comparisonLoading &&
          !comparisonError &&
          comparison && (
            <>
              <div className="terraform-drift-overview">
                <div className="terraform-drift-stat">
                  <span>Configuration</span>

                  <strong>
                    {configurationCount}
                  </strong>
                </div>

                <div className="terraform-drift-stat">
                  <span>State</span>

                  <strong>{stateCount}</strong>
                </div>

                <div className="terraform-drift-stat matched">
                  <span>Matched</span>

                  <strong>
                    {matchedCount}
                  </strong>
                </div>

                <div className="terraform-drift-stat missing">
                  <span>Missing from State</span>

                  <strong>
                    {missingCount}
                  </strong>
                </div>

                <div className="terraform-drift-stat unmanaged">
                  <span>Unmanaged</span>

                  <strong>
                    {unmanagedCount}
                  </strong>
                </div>
              </div>

              {configurationCount === 0 &&
                stateCount === 0 && (
                  <div className="terraform-drift-empty">
                    <strong>
                      No resources to compare
                    </strong>

                    <p>
                      Add Terraform resources to the
                      project to start drift detection.
                    </p>
                  </div>
                )}

              {missingCount > 0 && (
                <div className="terraform-drift-list-section">
                  <div className="terraform-drift-list-header">
                    <h3>
                      Missing from State
                    </h3>

                    <span>{missingCount}</span>
                  </div>

                  <div className="terraform-drift-list">
                    {comparison.comparison.missingFromState.resources.map(
                      (resource) => (
                        <div
                          className="terraform-drift-item missing"
                          key={resource}
                        >
                          <span className="terraform-drift-icon">
                            !
                          </span>

                          <code>{resource}</code>
                        </div>
                      )
                    )}
                  </div>
                </div>
              )}

              {unmanagedCount > 0 && (
                <div className="terraform-drift-list-section">
                  <div className="terraform-drift-list-header">
                    <h3>
                      Unmanaged Resources
                    </h3>

                    <span>
                      {unmanagedCount}
                    </span>
                  </div>

                  <div className="terraform-drift-list">
                    {comparison.comparison.unmanagedResources.resources.map(
                      (resource) => (
                        <div
                          className="terraform-drift-item unmanaged"
                          key={resource}
                        >
                          <span className="terraform-drift-icon">
                            ?
                          </span>

                          <code>{resource}</code>
                        </div>
                      )
                    )}
                  </div>
                </div>
              )}

              {matchedCount > 0 && (
                <div className="terraform-drift-list-section">
                  <div className="terraform-drift-list-header">
                    <h3>
                      Matched Resources
                    </h3>

                    <span>
                      {matchedCount}
                    </span>
                  </div>

                  <div className="terraform-drift-list">
                    {comparison.comparison.matched.resources.map(
                      (resource) => (
                        <div
                          className="terraform-drift-item matched"
                          key={resource}
                        >
                          <span className="terraform-drift-icon">
                            ✓
                          </span>

                          <code>{resource}</code>
                        </div>
                      )
                    )}
                  </div>
                </div>
              )}
            </>
          )}
      </div>

      <div className="terraform-project-actions">
        <button
          className="terraform-project-button"
          onClick={handleInit}
          disabled={operationLoading}
        >
          {initLoading
            ? "Initializing..."
            : "Init"}
        </button>

        <button
          className="terraform-project-button"
          onClick={handleValidate}
          disabled={operationLoading}
        >
          {validateLoading
            ? "Validating..."
            : "Validate"}
        </button>

        <button
          className="terraform-project-button primary"
          onClick={handlePlan}
          disabled={operationLoading}
        >
          {planLoading
            ? "Planning..."
            : "Plan"}
        </button>

        <button
          className="terraform-project-button apply"
          onClick={handleApply}
          disabled={operationLoading}
        >
          {applyLoading
            ? "Applying..."
            : "Apply"}
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

      {applyError && (
        <div className="terraform-empty-state">
          <h3>Terraform Apply Failed</h3>

          <p>{applyError}</p>
        </div>
      )}

      {applyOutput && (
        <div className="terraform-plan-output">
          <div className="terraform-plan-header">
            <div className="terraform-plan-title-row">
              <div className="terraform-plan-icon">
                T
              </div>

              <div>
                <h2>Terraform Apply</h2>

                <p>
                  Infrastructure changes applied
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
                terraform apply
              </span>
            </div>

            <pre className="terraform-terminal-output">
              {applyOutput}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}

export default TerraformProject;