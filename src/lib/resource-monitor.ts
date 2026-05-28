// lib/system-stats.ts
import os from "os";

function getCpuUsage(): Promise<number> {
  return new Promise((resolve) => {
    const cpus1 = os.cpus();

    setTimeout(() => {
      const cpus2 = os.cpus();
      let totalIdle = 0,
        totalTick = 0;

      for (let i = 0; i < cpus1.length; i++) {
        const before = cpus1[i].times;
        const after = cpus2[i].times;

        const idleDiff = after.idle - before.idle;
        const totalDiff =
          after.user -
          before.user +
          (after.nice - before.nice) +
          (after.sys - before.sys) +
          (after.idle - before.idle) +
          (after.irq - before.irq);

        totalIdle += idleDiff;
        totalTick += totalDiff;
      }

      const usagePercent = 100 - (100 * totalIdle) / totalTick;
      resolve(Math.round(usagePercent * 100) / 100);
    }, 200);
  });
}

function getMemoryUsage() {
  const total = os.totalmem();
  const free = os.freemem();
  const used = total - free;

  return {
    total: Math.round(total / 1024 / 1024), // MB
    used: Math.round(used / 1024 / 1024), // MB
    free: Math.round(free / 1024 / 1024), // MB
    percent: Math.round((used / total) * 10000) / 100 // %
  };
}

export async function getSystemStats() {
  const [cpu, memory] = await Promise.all([
    getCpuUsage(),
    Promise.resolve(getMemoryUsage())
  ]);
  return { cpu, memory };
}
