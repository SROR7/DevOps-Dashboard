require("dotenv").config();

const express = require("express");
const cors = require("cors");

const githubApi = require("./github");

const {
  getAwsOverview,
  getEc2Instances,
  getS3Buckets,
  getEksClusters,
  getRdsDatabases,
} = require("./aws");

const {
  getTerraformStatus,
  getTerraformProjects,
  runTerraformPlan,
  getTerraformProject,
  validateTerraformProjectConfig,
  runTerraformInit,
  getTerraformResources,
} = require("./terraform");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "DevOps Dashboard API",
    status: "running",
  });
});

app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
  });
});

app.get("/api/github/repos", async (req, res) => {
  try {
    const response = await githubApi.get(
      `/users/${process.env.GITHUB_USERNAME}/repos`,
      {
        params: {
          sort: "updated",
          per_page: 20,
        },
      }
    );

    res.json(response.data);
  } catch (error) {
    console.error(
      "GitHub API Error:",
      error.response?.data || error.message
    );

    res.status(error.response?.status || 500).json({
      error: "Failed to fetch GitHub repositories",
      message:
        error.response?.data?.message || error.message,
    });
  }
});

app.get("/api/github/actions", async (req, res) => {
  try {
    const repo = req.query.repo;

    if (!repo) {
      return res.status(400).json({
        error: "Repository name is required",
      });
    }

    const response = await githubApi.get(
      `/repos/${process.env.GITHUB_USERNAME}/${repo}/actions/runs`,
      {
        params: {
          per_page: 20,
        },
      }
    );

    res.json(response.data.workflow_runs);
  } catch (error) {
    console.error(
      "GitHub API Error:",
      error.response?.data || error.message
    );

    res.status(error.response?.status || 500).json({
      error: "Failed to fetch GitHub Actions",
      message:
        error.response?.data?.message || error.message,
    });
  }
});

app.get("/api/github/pulls", async (req, res) => {
  try {
    const repo = req.query.repo;

    if (!repo) {
      return res.status(400).json({
        error: "Repository name is required",
      });
    }

    const response = await githubApi.get(
      `/repos/${process.env.GITHUB_USERNAME}/${repo}/pulls`,
      {
        params: {
          state: "all",
          sort: "updated",
          direction: "desc",
          per_page: 20,
        },
      }
    );

    res.json(response.data);
  } catch (error) {
    console.error(
      "GitHub Pull Requests API Error:",
      error.response?.data || error.message
    );

    res.status(error.response?.status || 500).json({
      error: "Failed to fetch GitHub Pull Requests",
      message:
        error.response?.data?.message || error.message,
    });
  }
});

app.get("/api/github/issues", async (req, res) => {
  try {
    const repo = req.query.repo;

    if (!repo) {
      return res.status(400).json({
        error: "Repository name is required",
      });
    }

    const response = await githubApi.get(
      `/repos/${process.env.GITHUB_USERNAME}/${repo}/issues`,
      {
        params: {
          state: "all",
          sort: "updated",
          direction: "desc",
          per_page: 20,
        },
      }
    );

    const issues = response.data.filter(
      (item) => !item.pull_request
    );

    res.json(issues);
  } catch (error) {
    console.error(
      "GitHub Issues API Error:",
      error.response?.data || error.message
    );

    res.status(error.response?.status || 500).json({
      error: "Failed to fetch GitHub Issues",
      message:
        error.response?.data?.message || error.message,
    });
  }
});

app.get("/api/aws/overview", async (req, res) => {
  try {
    const data = await getAwsOverview();

    res.json(data);
  } catch (error) {
    console.error(
      "AWS API Error:",
      error.message
    );

    res.status(500).json({
      error: "Failed to fetch AWS data",
      message: error.message,
    });
  }
});

app.get("/api/aws/ec2", async (req, res) => {
  try {
    const instances = await getEc2Instances();

    res.json(instances);
  } catch (error) {
    console.error(
      "AWS EC2 API Error:",
      error.message
    );

    res.status(500).json({
      error: "Failed to fetch EC2 instances",
      message: error.message,
    });
  }
});

app.get("/api/aws/s3", async (req, res) => {
  try {
    const buckets = await getS3Buckets();

    res.json(buckets);
  } catch (error) {
    console.error(
      "AWS S3 API Error:",
      error.message
    );

    res.status(500).json({
      error: "Failed to fetch S3 buckets",
      message: error.message,
    });
  }
});

app.get("/api/aws/rds", async (req, res) => {
  try {
    const databases = await getRdsDatabases();

    res.json(databases);
  } catch (error) {
    console.error(
      "Failed to fetch RDS databases:",
      error
    );

    res.status(500).json({
      error: "Failed to fetch RDS databases",
      message: error.message,
    });
  }
});

app.get("/api/aws/eks", async (req, res) => {
  try {
    const clusters = await getEksClusters();

    res.json(clusters);
  } catch (error) {
    console.error(
      "AWS EKS API Error:",
      error.message
    );

    res.status(500).json({
      error: "Failed to fetch EKS clusters",
      message: error.message,
    });
  }
});

app.get("/api/terraform/status", async (req, res) => {
  try {
    const data = await getTerraformStatus();

    res.json(data);
  } catch (error) {
    console.error(
      "Terraform API Error:",
      error.message
    );

    res.status(500).json({
      installed: false,
      error: "Terraform is not available",
      message: error.message,
    });
  }
});

app.get("/api/terraform/projects", (req, res) => {
  try {
    const projects = getTerraformProjects();

    res.json(projects);
  } catch (error) {
    console.error(
      "Terraform Projects API Error:",
      error.message
    );

    res.status(500).json({
      error: "Failed to fetch Terraform projects",
      message: error.message,
    });
  }
});

app.post("/api/terraform/plan", async (req, res) => {
  try {
    const { project } = req.body;

    if (!project) {
      return res.status(400).json({
        error: "Project name is required",
      });
    }

    const result =
      await runTerraformPlan(project);

    res.json(result);
  } catch (error) {
    console.error(
      "Terraform Plan API Error:",
      error.message
    );

    res.status(500).json({
      error: "Terraform plan failed",
      message: error.message,
    });
  }
});

app.post(
  "/api/terraform/validate",
  async (req, res) => {
    try {
      const { project } = req.body;

      if (!project) {
        return res.status(400).json({
          error: "Project name is required",
        });
      }

      const result =
        await validateTerraformProjectConfig(
          project
        );

      res.json(result);
    } catch (error) {
      console.error(
        "Terraform Validate API Error:",
        error.message
      );

      res.status(500).json({
        error: "Terraform validation failed",
        message: error.message,
      });
    }
  }
);

app.post(
  "/api/terraform/init",
  async (req, res) => {
    try {
      const { project } = req.body;

      if (!project) {
        return res.status(400).json({
          error: "Project name is required",
        });
      }

      const result =
        await runTerraformInit(project);

      res.json(result);
    } catch (error) {
      console.error(
        "Terraform Init API Error:",
        error.message
      );

      res.status(500).json({
        error: "Terraform init failed",
        message: error.message,
      });
    }
  }
);

app.get(
  "/api/terraform/projects/:project/resources",
  (req, res) => {
    try {
      const resources =
        getTerraformResources(
          req.params.project
        );

      res.json(resources);
    } catch (error) {
      console.error(
        "Terraform Resources API Error:",
        error.message
      );

      res.status(500).json({
        error:
          "Failed to fetch Terraform resources",
        message: error.message,
      });
    }
  }
);

app.get(
  "/api/terraform/projects/:project",
  (req, res) => {
    try {
      const project =
        getTerraformProject(
          req.params.project
        );

      res.json(project);
    } catch (error) {
      console.error(
        "Terraform Project API Error:",
        error.message
      );

      res.status(500).json({
        error:
          "Failed to fetch Terraform project",
        message: error.message,
      });
    }
  }
);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(
    `Backend running on port ${PORT}`
  );
});