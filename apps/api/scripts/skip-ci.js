const { execSync } = require("node:child_process");

const branch = process.env.VERCEL_GIT_COMMIT_REF || "";
const commitMessage = execSync("git log -1 --pretty=%B").toString().trim();

// Skip build if commit message contains [skip ci]
if (commitMessage.includes("[skip ci]")) {
  console.log("Skipping build due to [skip ci] in commit message.");
  process.exit(0);
}

// Skip preview deployments for Renovate branches
if (branch.startsWith("renovate/") && process.env.VERCEL_ENV === "preview") {
  console.log("Skipping preview build for Renovate branch.");
  process.exit(0);
}

// Use turbo-ignore to check if this app was affected by the change
try {
  execSync("npx turbo-ignore", { stdio: "inherit" });
  process.exit(0);
} catch {
  process.exit(1);
}
