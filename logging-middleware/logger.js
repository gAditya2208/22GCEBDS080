import axios from 'axios';

const accessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiJnLmFkaXR5YTIyMDhAZ21haWwuY29tIiwiZXhwIjoxNzUxMDE0Mzg4LCJpYXQiOjE3NTEwMTM0ODgsImlzcyI6IkFmZm9yZCBNZWRpY2FsIFRlY2hub2xvZ2llcyBQcml2YXRlIExpbWl0ZWQiLCJqdGkiOiI4YzJlZTBlYS01ZWYyLTQ4M2YtYWFmNi0zMzlmYjJiOTY3MWMiLCJsb2NhbGUiOiJlbi1JTiIsIm5hbWUiOiJhZGl0eWEgZ3VwdGEiLCJzdWIiOiIxMDZmMmY5Ny1jMTQyLTQ5MDMtYjA5Mi1kZDg4ZjQ3YTFkYWYifSwiZW1haWwiOiJnLmFkaXR5YTIyMDhAZ21haWwuY29tIiwibmFtZSI6ImFkaXR5YSBndXB0YSIsInJvbGxObyI6IjIyZ2NlYmRzMDgwIiwiYWNjZXNzQ29kZSI6Ik11YWd2cSIsImNsaWVudElEIjoiMTA2ZjJmOTctYzE0Mi00OTAzLWIwOTItZGQ4OGY0N2ExZGFmIiwiY2xpZW50U2VjcmV0IjoiU1RYdEpUUXhhclVHc1puWiJ9.Tatn10LKD7T3B4PtkXFGoZV38kWU50cGMXZ354ALk2U";

function Log(stack, level, pkg, message) {
  const validStacks = ["backend", "frontend"];
  const validLevels = ["debug", "info", "warn", "error", "fatal"];
  const validPackages = [
    "api", "component", "hook", "page", "state", "style",
    "auth", "config", "middleware", "utils"
  ];

  if (!validStacks.includes(stack) || !validLevels.includes(level) || !validPackages.includes(pkg)) {
    console.error("Invalid stack/level/package");
    return;
  }

  axios.post("http://20.244.56.144/evaluation-service/logs", {
    stack,
    level,
    package: pkg,
    message
  }, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json"
    }
  }).then(res => {
    console.log("✅ Log created:", res.data);
  }).catch(err => {
    console.error("❌ Logging failed:", err.message);
  });
}

export { Log };