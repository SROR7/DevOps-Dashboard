require("dotenv").config();

const express = require("express");
const cors = require("cors");

const githubApi = require("./github");

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

// GitHub Repositories
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
      message: error.response?.data?.message || error.message,
    });
  }
});

// GitHub Actions
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
      "GitHub Actions API Error:",
      error.response?.data || error.message
    );

    res.status(error.response?.status || 500).json({
      error: "Failed to fetch GitHub Actions",
      message: error.response?.data?.message || error.message,
    });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});