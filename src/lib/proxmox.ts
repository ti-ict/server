import { proxmoxApi } from "proxmox-api";

if (
  ((process.env.NODE_ENV === "production" ||
    process.env.NODE_ENV === "development") &&
    !process.env.PROXMOX_HOST) ||
  !process.env.PROXMOX_TOKEN_ID ||
  !process.env.PROXMOX_TOKEN_SECRET
) {
  throw new Error("Missing Proxmox API credentials in environment variables");
}

export const proxmoxClient = proxmoxApi({
  host: process.env.PROXMOX_HOST!,
  tokenID: process.env.PROXMOX_TOKEN_ID!,
  tokenSecret: process.env.PROXMOX_TOKEN_SECRET!,
});

export async function waitForTask(node: string, taskId: string) {
  console.log("Waiting for task", taskId);

  for (let i = 0; i < 30; i++) {
    await new Promise((r) => setTimeout(r, 2000));

    const task = await proxmoxClient.nodes
      .$(node)
      .tasks.$(taskId)
      .status.$get();

    console.log(`Task status (${i}):`, task.status, task.exitstatus);

    if (task.status === "stopped" && task.exitstatus === "OK") return;
    if (task.exitstatus && task.exitstatus !== "OK") {
      throw new Error(`Task failed: ${task.exitstatus}`);
    }
  }
  throw new Error("Task timed out");
}
