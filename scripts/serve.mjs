import http from "node:http";
import { readFile } from "node:fs/promises";
import { resolve, extname, sep } from "node:path";
const root = process.cwd();
const types = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".jpeg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".pdf": "application/pdf",
  ".xml": "application/xml",
  ".txt": "text/plain",
};
http
  .createServer(async (req, res) => {
    try {
      const pathname = decodeURIComponent(
        new URL(req.url, "http://localhost").pathname,
      );
      const relative =
        pathname === "/" ? "index.html" : pathname.replace(/^\/+/, "");
      const file = resolve(root, relative);
      const allowed =
        [
          "index.html",
          "styles.css",
          "script.js",
          "sitemap.xml",
          "robots.txt",
        ].includes(relative) || relative.startsWith("public/");
      if (!allowed || !file.startsWith(root + sep)) {
        res.writeHead(404).end("Not found");
        return;
      }
      const content = await readFile(
        relative === "robots.txt" ? resolve(root, "public/robots.txt") : file,
      );
      res.writeHead(200, {
        "Content-Type": types[extname(file)] || "application/octet-stream",
        "Cache-Control": "no-cache",
      });
      res.end(content);
    } catch {
      res.writeHead(404).end("Not found");
    }
  })
  .listen(4173, "127.0.0.1", () => console.log("Local: http://localhost:4173"));
