import assert from "node:assert/strict";
import { readFile, access } from "node:fs/promises";
const html = await readFile("index.html", "utf8");
const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map((match) => match[1]);
assert.equal(new Set(ids).size, ids.length, "HTML IDs must be unique");
assert.equal(
  (html.match(/<h1\b/g) || []).length,
  1,
  "One main heading required",
);
let localLinks = 0;
for (const [, url] of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
  if (url.startsWith("#"))
    assert.ok(ids.includes(url.slice(1)), `Missing anchor ${url}`);
  else if (!/^(https?:|mailto:|tel:)/.test(url)) {
    await access(url);
    localLinks++;
  }
}
for (const [, attributes] of html.matchAll(/<img\b([^>]+)>/g))
  assert.match(attributes, /\balt="[^"]+"/, "Images need alt text");
for (const name of [
  "Private Health Tech SaaS Company",
  "Valkyrit IT Limited",
  "Wikiance",
  "Govt. Azizul Haque College",
  "Bogura Zilla School",
  "abidshahriar7@gmail.com",
])
  assert.ok(html.includes(name), `Missing portfolio content: ${name}`);
const css = await readFile("styles.css", "utf8");
assert.ok(
  css.includes("prefers-reduced-motion"),
  "Reduced motion support required",
);
assert.ok(css.includes("focus-visible"), "Visible keyboard focus required");
const pdf = await readFile("public/ABID_SHAHRIAR_RESUME.pdf");
assert.equal(
  pdf.subarray(0, 5).toString(),
  "%PDF-",
  "Resume must be a valid PDF file",
);
for (const file of ["index.html", "styles.css", "script.js", "sitemap.xml"])
  assert.equal(
    await readFile(file, "utf8"),
    await readFile(`dist/${file}`, "utf8"),
    `Stale build: ${file}`,
  );
console.log(
  `Checked ${ids.length} unique anchors, ${localLinks} local assets and downloads, portfolio content, accessibility hooks, and production output.`,
);
