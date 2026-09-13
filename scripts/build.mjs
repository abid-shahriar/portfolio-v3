import { copyFile, cp } from "node:fs/promises";
import { build } from "vite";
await build();
await copyFile("sitemap.xml", "dist/sitemap.xml");
await cp("public", "dist/public", { recursive: true });
await copyFile("public/robots.txt", "dist/robots.txt");
console.log("Built static portfolio in dist/");
