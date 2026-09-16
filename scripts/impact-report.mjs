#!/usr/bin/env node
/**
 * impact-report.mjs
 * PR mein jo files change hui, unko kaun import karta hai (direct + indirect)
 * wo nikaal ke ek markdown report + graph banata hai, jo PR pe comment hota hai.
 *
 * Env: CHANGED_FILES -> newline-separated changed files (git diff se)
 * Output: stdout pe markdown
 */
import {
  allDependents,
  buildGraph,
  dependentsIndex,
  errorDetail,
  isSource,
  isTest,
  short,
} from './lib/graph.mjs';

const changed = (process.env.CHANGED_FILES || '')
  .split('\n')
  .map((f) => f.trim())
  .filter(Boolean)
  .filter(isSource);

if (changed.length === 0) {
  console.log('_Koi source (.ts/.tsx/.js/.jsx) file change nahi hui — impact analysis skip._');
  process.exit(0);
}

let graph;
try {
  graph = buildGraph();
} catch (e) {
  // Asli wajah PR comment aur CI log dono mein dikhao, warna debug karna namumkin hai.
  const detail = errorDetail(e);
  console.error(detail);
  console.log('⚠️ Dependency graph nahi ban paaya. depcruise install/config check karo.');
  console.log('');
  console.log('<details><summary>Asli error</summary>');
  console.log('');
  console.log('```');
  console.log(detail);
  console.log('```');
  console.log('');
  console.log('</details>');
  process.exit(0);
}

const index = dependentsIndex(graph);

// Mermaid mein node id bare identifier hona chahiye — quoted string ko wo label
// ki tarah nahi, syntax error ki tarah padhta hai. Isliye har file ko ek safe
// id (n0, n1, ...) dete hain aur label sirf ek baar define karte hain.
const nodeIds = new Map();
const nodeDefs = [];
function mermaidNode(file) {
  if (!nodeIds.has(file)) {
    const id = `n${nodeIds.size}`;
    nodeIds.set(file, id);
    nodeDefs.push(`  ${id}["${short(file).replace(/"/g, '#quot;')}"]`);
  }
  return nodeIds.get(file);
}

let md = '## 🔎 PR Impact Analysis\n\n';
md += `Is PR mein **${changed.length}** source file change hui hain. Merge se pehle neeche waale areas verify kar lena.\n\n`;

const globalAffected = new Set();
const graphEdges = [];

for (const file of changed) {
  const deps = allDependents(index, file);
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

  // Arrow importer se changed file ki taraf jaata hai, kyunki import ki
  // direction wahi hai. Graph chhota rakhne ke liye per file 8 edge.
  [...deps].slice(0, 8).forEach((d) => {
    graphEdges.push(`  ${mermaidNode(d)} --> ${mermaidNode(file)}`);
  });
}

// Mermaid graph (GitHub PR comment mein render hota hai)
if (graphEdges.length) {
  md += '### 🕸️ Dependency graph\n\n';
  md += '_Arrow ka matlab: **A --> B** yaani A, B ko import karta hai._\n\n';
  md += '```mermaid\ngraph LR\n' +
    nodeDefs.join('\n') + '\n' +
    [...new Set(graphEdges)].join('\n') +
    '\n```\n\n';
}

md += '---\n';
md += `**Total unique files affected:** ${globalAffected.size}\n\n`;
if (globalAffected.size > 40) {
  md += '> ⚠️ **Bada blast radius (40+ files)** — extra dhyaan se review karo.\n\n';
}
md += '_Automated analysis. Copilot review ke saath dono dekh ke verify karna._';

console.log(md);
