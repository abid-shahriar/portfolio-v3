import { mkdir, copyFile, cp } from "node:fs/promises";
await mkdir("dist", { recursive: true });
for (const file of ["index.html", "styles.css", "script.js", "sitemap.xml"])
  await copyFile(file, `dist/${file}`);
await cp("public", "dist/public", { recursive: true });
await copyFile("public/robots.txt", "dist/robots.txt");
console.log("Built static portfolio in dist/");
