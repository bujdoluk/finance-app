import { Request, Response } from "express";
import os from "os";

export const getPerformanceInfo = (req: Request, res: Response) => {
  const start = process.hrtime.bigint(); 
  const memory = process.memoryUsage();

  const perf = {
    app: {
      environment: process.env.NODE_ENV ?? "development",
      name: "finance-api",
      node_version: process.version,
      uptime_seconds: process.uptime()
    },

    performance: {
      cpu_usage: process.cpuUsage(),

      event_loop_delay_ms:
        Number(process.hrtime.bigint() - start) / 1_000_000,

      memory: {
        external_mb: (memory.external / 1024 / 1024).toFixed(2),
        heap_total_mb: (memory.heapTotal / 1024 / 1024).toFixed(2),
        heap_used_mb: (memory.heapUsed / 1024 / 1024).toFixed(2),
        rss_mb: (memory.rss / 1024 / 1024).toFixed(2)
      }
    },

    system: {
      architecture: process.arch,
      cores: os.cpus().length,
      loadavg: os.loadavg(),
      platform: process.platform
    },

    timestamp: new Date().toISOString()
  };

  return res.json(perf);
};
