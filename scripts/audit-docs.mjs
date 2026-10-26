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
  const initialErrors = errorCount;
  const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;

  // Planned future files that are referenced in documentation contracts
  const allowedFutureFiles = new Set([
    "src/config/site.ts",
    "src/lib/schemas/contact.ts",
    "src/env/server.ts",
    "src/env/client.ts",
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
        logError(
          `Broken link in ${relativePath}: "${target}" -> target not found at "${targetRelToRoot}"`
        );
      }
    }
  }

  if (errorCount === initialErrors) {
    logSuccess("All internal markdown links are valid.");
  }
}

/**
 * Check 2: File Tree Synchronization in docs/04-folder-structure.md
 */
function checkFolderStructureSync() {
  console.log("\n🔍 Checking file tree synchronization in docs/04-folder-structure.md...");
  const initialErrors = errorCount;
  const folderStructurePath = path.join(ROOT_DIR, "docs", "04-folder-structure.md");

  if (!fs.existsSync(folderStructurePath)) {
    logError("docs/04-folder-structure.md not found.");
    return;
  }

  const content = fs.readFileSync(folderStructurePath, "utf-8");

  // Collect all real files in src/ and tests/ to ensure they are documented
  function getRealCodeFiles(dir, list = []) {
    if (!fs.existsSync(dir)) return list;
    const items = fs.readdirSync(dir, { withFileTypes: true });
    for (const item of items) {
      const full = path.join(dir, item.name);
      if (item.isDirectory()) {
        getRealCodeFiles(full, list);
      } else {
        list.push(full);
      }
    }
    return list;
  }

  const specsDir = path.join(ROOT_DIR, "specs");
  const specFolders = fs.existsSync(specsDir)
    ? fs
        .readdirSync(specsDir, { withFileTypes: true })
        .filter((d) => d.isDirectory())
        .map((d) => path.join(specsDir, d.name))
    : [];

  const realFiles = [
    path.join(ROOT_DIR, "package.json"),
    path.join(ROOT_DIR, "package-lock.json"),
    path.join(ROOT_DIR, "tsconfig.json"),
    path.join(ROOT_DIR, "next.config.ts"),
    path.join(ROOT_DIR, "eslint.config.mjs"),
    path.join(ROOT_DIR, "postcss.config.mjs"),
    path.join(ROOT_DIR, "vitest.config.ts"),
    path.join(ROOT_DIR, "components.json"),
    ...getRealCodeFiles(path.join(ROOT_DIR, "src")),
    ...getRealCodeFiles(path.join(ROOT_DIR, "tests")),
    ...specFolders,
  ];

  for (const file of realFiles) {
    const baseName = path.basename(file);
    if (!content.includes(baseName)) {
      logError(
        `docs/04-folder-structure.md is missing documentation for existing item: "${baseName}" (${path.relative(ROOT_DIR, file)})`
      );
    }
  }

  // Check that UI components documented in docs/04 actually exist on disk (avoid phantom files like toast.tsx)
  const uiSectionMatch = content.match(/ui\/\s*#.*?([\s\S]*?)├──\s*config/);
  if (uiSectionMatch) {
    const uiLines = uiSectionMatch[1].split("\n");
    for (const line of uiLines) {
      const match = line.match(/[├└]──\s*([a-zA-Z0-9_-]+\.tsx)/);
      if (match) {
        const componentName = match[1];
        const fullPath = path.join(ROOT_DIR, "src", "components", "ui", componentName);
        if (!fs.existsSync(fullPath)) {
          logError(
            `docs/04-folder-structure.md documents non-existent UI component: "src/components/ui/${componentName}"`
          );
        }
      }
    }
  }

  if (errorCount === initialErrors) {
    logSuccess("docs/04-folder-structure.md is synchronized with existing code files.");
  }
}

/**
 * Check 3: Anti-Doc Rot (Principle 9 of AGENTS.md)
 * Verifies that implemented code in src/ is not duplicated as raw code blocks in docs/
 */
function checkAntiDocRot() {
  console.log("\n🔍 Checking Principle 9 (Anti-Doc Rot) across documentation...");
  const initialErrors = errorCount;

  const implementedSignatures = [
    { pattern: "const nextConfig: NextConfig = {", desc: "next.config.ts configuration" },
    { pattern: "export const contactFormSchema", desc: "contactFormSchema definition" },
    { pattern: "export async function sendContactEmail", desc: "sendContactEmail server action" },
    { pattern: "export const clientEnvSchema", desc: "clientEnvSchema definition" },
    { pattern: "export const serverEnvSchema", desc: "serverEnvSchema definition" },
    { pattern: "export function ContactForm", desc: "ContactForm component implementation" },
    { pattern: "export function Header", desc: "Header component implementation" },
    { pattern: "export function Footer", desc: "Footer component implementation" },
    {
      pattern: "export function FloatingWhatsApp",
      desc: "FloatingWhatsApp component implementation",
    },
  ];

  const docsDir = path.join(ROOT_DIR, "docs");
  if (fs.existsSync(docsDir)) {
    const docFiles = findMarkdownFiles(docsDir);

    for (const filePath of docFiles) {
      const relPath = path.relative(ROOT_DIR, filePath).replace(/\\/g, "/");
      const fileContent = fs.readFileSync(filePath, "utf-8");

      // Extract markdown code blocks (```typescript, ```tsx, ```ts)
      const codeBlockRegex = /```(?:typescript|tsx|ts|jsx)\s*([\s\S]*?)```/g;
      let blockMatch;
      while ((blockMatch = codeBlockRegex.exec(fileContent)) !== null) {
        const blockCode = blockMatch[1];
        for (const sig of implementedSignatures) {
          if (blockCode.includes(sig.pattern)) {
            logError(
              `Anti-Doc Rot violation in ${relPath}: contains duplicated code block for ${sig.desc}. Reference the real code in src/ via link per Principle 9.`
            );
          }
        }
      }
    }
  }

  if (errorCount === initialErrors) {
    logSuccess("Anti-Doc Rot check passed: implemented files are referenced via links.");
  }
}

/**
 * Helper: format completed features label, e.g.
 * - [001] -> "Feature 001 Concluída"
 * - [001, 002] -> "Features 001 e 002 Concluídas"
 * - [001, 002, 003] -> "Features 001, 002 e 003 Concluídas"
 */
function formatCompletedFeaturesLabel(features) {
  if (features.length === 0) return "Nenhuma Feature Concluída";
  if (features.length === 1) return `Feature ${features[0].num} Concluída`;
  const nums = features.map((f) => f.num);
  const last = nums.pop();
  return `Features ${nums.join(", ")} e ${last} Concluídas`;
}

/**
 * Check 4: Roadmap & Status Synchronization
 * Uses CHANGELOG.md as single source of truth for completed and pending features,
 * asserting that README.md, docs/03-project-roadmap.md and specs/ match it semantically.
 */
function checkRoadmapSync() {
  console.log("\n🔍 Checking Roadmap and Status Synchronization...");
  const initialErrors = errorCount;
  const changelogPath = path.join(ROOT_DIR, "CHANGELOG.md");
  const roadmapPath = path.join(ROOT_DIR, "docs", "03-project-roadmap.md");
  const readmePath = path.join(ROOT_DIR, "README.md");

  if (!fs.existsSync(changelogPath)) {
    logError("CHANGELOG.md not found.");
    return;
  }
  if (!fs.existsSync(roadmapPath)) {
    logError("docs/03-project-roadmap.md not found.");
    return;
  }
  if (!fs.existsSync(readmePath)) {
    logError("README.md not found.");
    return;
  }

  const changelogContent = fs.readFileSync(changelogPath, "utf-8");
  const roadmapContent = fs.readFileSync(roadmapPath, "utf-8");
  const readmeContent = fs.readFileSync(readmePath, "utf-8");

  // Parse features from CHANGELOG.md (supports both - and * markdown list bullets)
  const featureRegex = /[-*]\s*\[([ xX])\]\s*\*\*Feature\s*(\d{3}):\s*([^*]+)\*\*/g;
  const completedFeatures = [];
  const pendingFeatures = [];
  let match;

  while ((match = featureRegex.exec(changelogContent)) !== null) {
    const isDone = match[1].toLowerCase() === "x";
    const featureNum = match[2];
    const featureName = match[3].trim();
    if (isDone) {
      completedFeatures.push({ num: featureNum, name: featureName });
    } else {
      pendingFeatures.push({ num: featureNum, name: featureName });
    }
  }

  if (completedFeatures.length === 0 && pendingFeatures.length === 0) {
    logError("Could not parse any features from CHANGELOG.md under '### 📊 Status das Features'.");
    return;
  }

  // 1. Verify roadmap active status badge
  const hasPhase2InProgress = roadmapContent.includes(
    "Fase 2<br/>Core & MVP em Código<br/>(Em Andamento)"
  );
  const hasReadmePhase2Badge = readmeContent.includes("Status-Fase_2_Em_Andamento");

  if (!hasPhase2InProgress) {
    logError("docs/03-project-roadmap.md should mark Phase 2 as '(Em Andamento)'.");
  }

  if (!hasReadmePhase2Badge) {
    logError("README.md badge should indicate 'Status-Fase_2_Em_Andamento'.");
  }

  // 2. Expected completed features label (e.g. "Features 001 e 002 Concluídas")
  const expectedLabel = formatCompletedFeaturesLabel(completedFeatures);

  if (!readmeContent.includes(expectedLabel)) {
    logError(
      `README.md does not contain the expected status label "${expectedLabel}" derived from CHANGELOG.md.`
    );
  }

  if (!roadmapContent.includes(expectedLabel)) {
    logError(
      `docs/03-project-roadmap.md does not contain the expected status label "${expectedLabel}" derived from CHANGELOG.md.`
    );
  }

  // 3. Verify each completed feature is mentioned in README, Roadmap, and specs have Concluída status
  const specsDir = path.join(ROOT_DIR, "specs");
  for (const feat of completedFeatures) {
    if (!readmeContent.includes(`Feature ${feat.num}`)) {
      logError(`README.md is missing reference to completed Feature ${feat.num}.`);
    }
    if (!roadmapContent.includes(`Feature ${feat.num}`)) {
      logError(`docs/03-project-roadmap.md is missing reference to completed Feature ${feat.num}.`);
    }

    // Spec status parity check
    if (fs.existsSync(specsDir)) {
      const folders = fs.readdirSync(specsDir).filter((f) => f.startsWith(feat.num));
      for (const folder of folders) {
        const specFile = path.join(specsDir, folder, "spec.md");
        if (fs.existsSync(specFile)) {
          const specText = fs.readFileSync(specFile, "utf-8");
          if (
            !specText.includes("Status:** Concluída") &&
            !specText.includes("Status:** Concluído")
          ) {
            logError(
              `Spec for completed Feature ${feat.num} (${folder}/spec.md) is not marked as 'Concluída'.`
            );
          }
        }
      }
    }
  }

  // 4. Verify the active feature (next pending feature) is mentioned in README and Roadmap
  if (pendingFeatures.length > 0) {
    const nextActive = pendingFeatures[0];
    if (!readmeContent.includes(`Feature ${nextActive.num}`)) {
      logError(
        `README.md is missing reference to current active Feature ${nextActive.num} ("${nextActive.name}").`
      );
    }
    if (!roadmapContent.includes(`Feature ${nextActive.num}`)) {
      logError(
        `docs/03-project-roadmap.md is missing reference to current active Feature ${nextActive.num} ("${nextActive.name}").`
      );
    }
  }

  if (errorCount === initialErrors) {
    logSuccess(
      `Roadmap and status documentation are dynamically synchronized (${expectedLabel}, próxima: Feature ${pendingFeatures[0]?.num ?? "N/A"}).`
    );
  }
}

/**
 * Check 5: Guardrail - Zero Raw Hex Colors in UI Components
 * Asserts that components in src/components/ do not use raw hex colors (#fff, #25D366, etc.)
 */
function checkSemanticColors() {
  console.log("\n🔍 Checking for zero raw hex colors in UI components...");
  const initialErrors = errorCount;
  const componentsDir = path.join(ROOT_DIR, "src", "components");

  if (!fs.existsSync(componentsDir)) return;

  function findTsxFiles(dir, list = []) {
    const items = fs.readdirSync(dir, { withFileTypes: true });
    for (const item of items) {
      const full = path.join(dir, item.name);
      if (item.isDirectory()) {
        findTsxFiles(full, list);
      } else if (item.name.endsWith(".tsx")) {
        list.push(full);
      }
    }
    return list;
  }

  const tsxFiles = findTsxFiles(componentsDir);
  const hexRegex = /#[0-9a-fA-F]{3,8}\b/g;

  for (const file of tsxFiles) {
    const content = fs.readFileSync(file, "utf-8");
    const rel = path.relative(ROOT_DIR, file).replace(/\\/g, "/");
    const lines = content.split("\n");

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const trimmed = line.trim();
      if (trimmed.startsWith("//") || trimmed.startsWith("/*") || trimmed.startsWith("*")) {
        continue;
      }
      const matches = line.match(hexRegex);
      if (matches) {
        logError(
          `Raw hex color found in ${rel}:${i + 1} (${matches.join(", ")}). Use semantic design tokens from globals.css instead.`
        );
      }
    }
  }

  if (errorCount === initialErrors) {
    logSuccess("Zero raw hex colors found across UI components.");
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
  checkSemanticColors();

  console.log("\n------------------------------------------");
  if (errorCount > 0) {
    console.error(
      `❌ Documentation Audit FAILED with ${errorCount} error(s) and ${warningCount} warning(s).`
    );
    process.exit(1);
  } else {
    console.log(`✅ Documentation Audit PASSED with 0 errors and ${warningCount} warning(s).`);
    console.log("==========================================\n");
    process.exit(0);
  }
}

main();
