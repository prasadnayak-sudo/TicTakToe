#!/usr/bin/env node
/**
 * impact-report.mjs
 * PR mein jo files change hui, unko kaun import karta hai (direct + indirect)
 * wo nikaal ke ek markdown report + graph banata hai, jo PR pe comment hota hai.
 *
 * Env: CHANGED_FILES -> newline-separated changed files (git diff se)
 * Output: stdout pe markdown
 */
import { execSync } from 'node:child_process';

const changed = (process.env.CHANGED_FILES || '')
  .split('\n')
  .map((f) => f.trim())
  .filter(Boolean)
  .filter((f) => /\.(ts|tsx|js|jsx)$/.test(f))
  .filter((f) => !f.includes('node_modules'));

if (changed.length === 0) {
  console.log('_Koi source (.ts/.tsx/.js/.jsx) file change nahi hui — impact analysis skip._');
  process.exit(0);
}

let graph;
try {
  const out = execSync(
    'npx depcruise src --config .dependency-cruiser.cjs --output-type json',
    { encoding: 'utf8', maxBuffer: 1024 * 1024 * 64 }
  );
  graph = JSON.parse(out);
} catch (e) {
  console.log('⚠️ Dependency graph nahi ban paaya. depcruise install/config check karo.');
  process.exit(0);
}

// Reverse index: file -> usko import karne waale
const dependents = new Map();
for (const mod of graph.modules) {
  for (const dep of mod.dependencies || []) {
    if (!dependents.has(dep.resolved)) dependents.set(dep.resolved, new Set());
    dependents.get(dep.resolved).add(mod.source);
  }
}

function allDependents(file) {
  const seen = new Set();
  const queue = [file];
  while (queue.length) {
    const cur = queue.shift();
    for (const parent of dependents.get(cur) || []) {
      if (!seen.has(parent)) { seen.add(parent); queue.push(parent); }
    }
  }
  return seen;
}

const isTest = (f) => /\.(test|spec)\.(ts|tsx|js|jsx)$/.test(f) || f.includes('__tests__');
const short = (f) => f.replace(/^src\//, '');

let md = '## 🔎 PR Impact Analysis\n\n';
md += `Is PR mein **${changed.length}** source file change hui hain. Merge se pehle neeche waale areas verify kar lena.\n\n`;

const globalAffected = new Set();
const graphEdges = [];

for (const file of changed) {
  const deps = allDependents(file);
  deps.forEach((d) => globalAffected.add(d));
  const tests = [...deps].filter(isTest);
  const nonTests = [...deps].filter((d) => !isTest(d));

  md += `### \`${short(file)}\`\n`;
  if (deps.size === 0) {
    md += '- ✅ Koi file isko import nahi karti — isolated change.\n\n';
    continue;
  }
  md += `- **${nonTests.length}** file directly/indirectly affected\n`;
  nonTests.slice(0, 12).forEach((d) => (md += `  - \`${short(d)}\`\n`));
  if (nonTests.length > 12) md += `  - _...aur ${nonTests.length - 12} aur_\n`;
  if (tests.length) {
    md += `- 🧪 **${tests.length}** test file is chain mein — zaroor verify karo\n`;
  }
  md += '\n';

  // graph edges (max thoda sa, warna diagram bahut bada)
  [...deps].slice(0, 8).forEach((d) => {
    graphEdges.push(`  ${JSON.stringify(short(file))} --> ${JSON.stringify(short(d))}`);
  });
}

// Mermaid graph (GitHub PR comment mein render hota hai)
if (graphEdges.length) {
  md += '### 🕸️ Dependency graph (kaun kis pe depend karta hai)\n\n';
  md += '```mermaid\ngraph LR\n' + graphEdges.join('\n') + '\n```\n\n';
}

md += '---\n';
md += `**Total unique files affected:** ${globalAffected.size}\n\n`;
if (globalAffected.size > 40) {
  md += '> ⚠️ **Bada blast radius (40+ files)** — extra dhyaan se review karo.\n\n';
}
md += '_Automated analysis. Copilot review ke saath dono dekh ke verify karna._';

console.log(md);
