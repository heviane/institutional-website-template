#!/usr/bin/env node

/**
 * Documentation Quality Gate Script
 * Validates documentation integrity, internal links, file tree synchronization,
 * and compliance with Principle 9 (Anti-Doc Rot) from AGENTS.md.
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, "..");

let errorCount = 0;
let warningCount = 0;

function logError(message) {
  console.error(`❌ [ERROR] ${message}`);
  errorCount++;
}

function logWarning(message) {
  console.warn(`⚠️  [WARN]  ${message}`);
  warningCount++;
}

function logSuccess(message) {
  console.log(`✅ [OK]    ${message}`);
}

/**
 * Recursively find all markdown files in a directory
 */
function findMarkdownFiles(dir, fileList = []) {
  const items = fs.readdirSync(dir, { withFileTypes: true });
  for (const item of items) {
    if (item.name === "node_modules" || item.name === ".git" || item.name === ".next") {
      continue;
    }
    const fullPath = path.join(dir, item.name);
    if (item.isDirectory()) {
      findMarkdownFiles(fullPath, fileList);
    } else if (item.name.endsWith(".md") || item.name.endsWith(".mdc")) {
      fileList.push(fullPath);
    }
  }
  return fileList;
}

/**
 * Check 1: Validate internal markdown links
 */
function checkInternalLinks(markdownFiles) {
  console.log("\n🔍 Checking internal markdown links integrity...");
  const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;

  // Planned future files that are referenced in documentation contracts
  const allowedFutureFiles = new Set([
    "src/config/site.ts",
    "src/lib/schemas/contact.ts",
    "src/lib/validations/contact.ts",
    "src/env.ts",
    "src/app/actions/contact.ts",
    "src/lib/rate-limit.ts",
    "src/lib/resend.ts",
    "src/lib/keystatic.ts",
    "keystatic.config.ts",
    "lighthouserc.json",
  ]);

  for (const filePath of markdownFiles) {
    const relativePath = path.relative(ROOT_DIR, filePath).replace(/\\/g, "/");
    // Ignore draft notes from strict link checks
    if (relativePath.startsWith("docs/drafts/")) {
      continue;
    }

    const content = fs.readFileSync(filePath, "utf-8");
    let match;

    while ((match = linkRegex.exec(content)) !== null) {
      const target = match[2].trim();

      // Skip external URLs, anchors, mailto
      if (
        target.startsWith("http://") ||
        target.startsWith("https://") ||
        target.startsWith("mailto:") ||
        target.startsWith("#") ||
        target.startsWith("file://")
      ) {
        continue;
      }

      // Remove anchor and query parameters
      const cleanTarget = target.split("#")[0].split("?")[0];
      if (!cleanTarget) continue;

      // Resolve relative path
      const targetFullPath = path.resolve(path.dirname(filePath), cleanTarget);
      const targetRelToRoot = path.relative(ROOT_DIR, targetFullPath).replace(/\\/g, "/");

      if (!fs.existsSync(targetFullPath) && !allowedFutureFiles.has(targetRelToRoot)) {
        logError(`Broken link in ${relativePath}: "${target}" -> target not found at "${targetRelToRoot}"`);
      }
    }
  }

  if (errorCount === 0) {
    logSuccess("All internal markdown links are valid.");
  }
}

/**
 * Check 2: File Tree Synchronization in docs/04-folder-structure.md
 */
function checkFolderStructureSync() {
  console.log("\n🔍 Checking file tree synchronization in docs/04-folder-structure.md...");
  const folderStructurePath = path.join(ROOT_DIR, "docs", "04-folder-structure.md");

  if (!fs.existsSync(folderStructurePath)) {
    logError("docs/04-folder-structure.md not found.");
    return;
  }

  const content = fs.readFileSync(folderStructurePath, "utf-8");

  // Key implemented files that MUST be documented in the tree
  const requiredFiles = [
    "package.json",
    "package-lock.json",
    "tsconfig.json",
    "next.config.ts",
    "eslint.config.mjs",
    "postcss.config.mjs",
    "vitest.config.ts",
    "src/app/globals.css",
    "src/app/layout.tsx",
    "src/app/page.tsx",
    "src/lib/utils.ts",
    "tests/sanity.test.ts",
    "tests/utils.test.ts",
    "specs/",
  ];

  for (const item of requiredFiles) {
    const baseName = item.endsWith("/") ? item.slice(0, -1) : path.basename(item);
    if (!content.includes(baseName)) {
      logError(`docs/04-folder-structure.md is missing documentation for existing item: "${item}"`);
    }
  }

  if (errorCount === 0) {
    logSuccess("docs/04-folder-structure.md is synchronized with existing code files.");
  }
}

/**
 * Check 3: Anti-Doc Rot (Principle 9 of AGENTS.md)
 * Verifies that implemented code in src/ is not duplicated as raw code blocks in docs/
 */
function checkAntiDocRot() {
  console.log("\n🔍 Checking Principle 9 (Anti-Doc Rot) across documentation...");
  const setupDocPath = path.join(ROOT_DIR, "docs", "02-environment-setup.md");

  if (fs.existsSync(setupDocPath)) {
    const content = fs.readFileSync(setupDocPath, "utf-8");

    // next.config.ts is implemented; it should not contain duplicated typescript code block
    if (content.includes("const nextConfig: NextConfig = {") && content.includes("export default nextConfig;")) {
      logError(
        "docs/02-environment-setup.md contains duplicate next.config.ts code block. Replace with link to next.config.ts per Principle 9."
      );
    }
  }

  if (errorCount === 0) {
    logSuccess("Anti-Doc Rot check passed: implemented files are referenced via links.");
  }
}

/**
 * Check 4: Roadmap & Status Synchronization
 */
function checkRoadmapSync() {
  console.log("\n🔍 Checking Roadmap and Status Synchronization...");
  const roadmapPath = path.join(ROOT_DIR, "docs", "03-project-roadmap.md");
  const readmePath = path.join(ROOT_DIR, "README.md");

  if (fs.existsSync(roadmapPath) && fs.existsSync(readmePath)) {
    const roadmapContent = fs.readFileSync(roadmapPath, "utf-8");
    const readmeContent = fs.readFileSync(readmePath, "utf-8");

    // Check that Phase 2 is marked as in progress since Feature 001 is completed
    if (roadmapContent.includes("Fase 2<br/>Core & MVP em Código<br/>(Aguardando Início)")) {
      logError("docs/03-project-roadmap.md still marks Phase 2 as 'Aguardando Início'. Update to 'Em Andamento'.");
    }

    if (readmeContent.includes("Status-Fase_1_Concluída")) {
      logError("README.md badge still points to 'Status-Fase_1_Concluída'. Update to 'Status-Fase_2_Em_Andamento'.");
    }
  }

  if (errorCount === 0) {
    logSuccess("Roadmap and status documentation are synchronized.");
  }
}

/**
 * Main execution
 */
function main() {
  console.log("==========================================");
  console.log("   📚 Documentation Quality Gate Audit   ");
  console.log("==========================================");

  const rootFiles = [
    path.join(ROOT_DIR, "README.md"),
    path.join(ROOT_DIR, "AGENTS.md"),
    path.join(ROOT_DIR, "CHANGELOG.md"),
    path.join(ROOT_DIR, "CONTRIBUTING.md"),
    path.join(ROOT_DIR, "SECURITY.md"),
  ].filter((f) => fs.existsSync(f));

  const docsFiles = fs.existsSync(path.join(ROOT_DIR, "docs"))
    ? findMarkdownFiles(path.join(ROOT_DIR, "docs"))
    : [];

  const specsFiles = fs.existsSync(path.join(ROOT_DIR, "specs"))
    ? findMarkdownFiles(path.join(ROOT_DIR, "specs"))
    : [];

  const allMarkdownFiles = [...rootFiles, ...docsFiles, ...specsFiles];

  checkInternalLinks(allMarkdownFiles);
  checkFolderStructureSync();
  checkAntiDocRot();
  checkRoadmapSync();

  console.log("\n------------------------------------------");
  if (errorCount > 0) {
    console.error(`❌ Documentation Audit FAILED with ${errorCount} error(s) and ${warningCount} warning(s).`);
    process.exit(1);
  } else {
    console.log(`✅ Documentation Audit PASSED with 0 errors and ${warningCount} warning(s).`);
    console.log("==========================================\n");
    process.exit(0);
  }
}

main();
