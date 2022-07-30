import "dotenv/config.js";
import express from "express";
import fs from "fs";
import cloneAndPullRepo from "./cloneAndPullRepo.js";
import ProgressBar from "progress";

const app = express();

app.get("/cloneJSON", () => {
  fs.readFile("./repos.json", "utf8", (err, jsonString) => {
    if (err) {
      console.log("Error reading file from disk:", err);
      return;
    }
    const repos = JSON.parse(jsonString);
    let bar = new ProgressBar("  fetching repos[:bar]", {
      complete: "=",
      incomplete: " ",
      width: 20,
      total: Object.keys(repos).length,
    });
    try {
      repos.map((item, index) => {
        console.log();
        const repoPath = `${item.username}/${item.repo}`;
        const repoExists = fs.existsSync(`repos/${repoPath}`);
        const confirmation = repoExists
          ? `${index + 1}.Pulling ${repoPath} branch:${item.branch}...`
          : `${index + 1}.Cloning ${repoPath} branch:${item.branch}...`;
        //   console.log(repoPath, repoExists, item.branch);
        // console.log(confirmation);
        cloneAndPullRepo(repoExists, item.username, item.repo, item.branch);
        bar.tick(index);
      });
      console.log("\n");
    } catch (err) {
      console.log("Error parsing JSON string:", err);
    }
  });
});

app.get("/repos/clone/:username/:repo", (req, res) => {
  const username = req?.params?.username;
  const repo = req?.params?.repo;
  const repoPath = `${username}/${repo}`;
  const repoExists = fs.existsSync(`repos/${repoPath}`);
  const confirmation = repoExists
    ? `Pulling ${repoPath}...`
    : `Cloning ${repoPath}...`;

  cloneAndPullRepo(repoExists, username, repo, req?.query?.branch);

  res.status(200).send(confirmation);
  req.on("close", function () {
    console.log("Request was closed!");
  });
});

app.listen(3000, () => {
  console.log("App running at http://localhost:3000");
});
