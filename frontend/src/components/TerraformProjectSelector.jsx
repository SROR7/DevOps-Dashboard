function TerraformProjectSelector({
    projects,
    selectedProject,
    onProjectChange,
    loading,
    error,
  }) {
    return (
      <div className="terraform-project-selector">
        <div className="terraform-selector-header">
          <div>
            <label
              htmlFor="terraform-project"
              className="terraform-selector-label"
            >
              Select Terraform Project
            </label>
  
            <p className="terraform-selector-description">
              Choose a local Terraform project to inspect.
            </p>
          </div>
        </div>
  
        <select
          id="terraform-project"
          className="terraform-project-select"
          value={selectedProject}
          onChange={(event) =>
            onProjectChange(event.target.value)
          }
          disabled={loading || !!error}
        >
          <option value="">
            {loading
              ? "Loading projects..."
              : error
              ? "Unable to load projects"
              : projects.length === 0
              ? "No Terraform projects found"
              : "Select a Terraform project"}
          </option>
  
          {projects.map((project) => (
            <option
              key={project.name}
              value={project.name}
            >
              {project.name}
            </option>
          ))}
        </select>
  
        {error && (
          <div className="terraform-selector-error">
            {error}
          </div>
        )}
      </div>
    );
  }
  
  export default TerraformProjectSelector;