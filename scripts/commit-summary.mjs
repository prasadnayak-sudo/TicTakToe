#!/usr/bin/env node
/**
 * commit-summary.mjs
 * Ek chhota summary block banata hai jo PR description mein jaata hai — aur
 * wahan se squash/merge commit ke message mein.
 *
 * Commit message ke liye jaan-boojh ke compact hai: koi mermaid graph nahi
 * (message mein render hota hi nahi) aur lambi file lists nahi. Poori report
 * PR comment mein alag se aati hai.
 *
 * Env: CHANGED_FILES -> newline-separated changed files
 * Output: stdout pe plain markdown
 */
import {
  allDependents,
  buildGraph,
  dependentsIndex,
  isSource,
  isTest,
  short,
} from './lib/graph.mjs';

const changed = (process.env.CHANGED_FILES || '')
  .split('\n')
  .map((f) => f.trim())
  .filter(Boolean);

const source = changed.filter(isSource);
const tests = changed.filter(isTest);

const out = [];
out.push(`Changes ${changed.length} file${changed.length === 1 ? '' : 's'}` +
  (source.length ? `, ${source.length} of them source` : '') +
  (tests.length ? `, ${tests.length} test` : '') + '.');

if (source.length) {
  try {
    const index = dependentsIndex(buildGraph());

    const ranked = source
      .map((file) => ({ file, total: allDependents(index, file).size }))
      .filter((r) => r.total > 0)
      .sort((a, b) => b.total - a.total);

    const affected = new Set();
    for (const file of source) allDependents(index, file).forEach((d) => affected.add(d));

    if (affected.size > 0) {
      out.push('');
      out.push(`Blast radius: ${affected.size} file${affected.size === 1 ? '' : 's'} affected.`);
      ranked.slice(0, 5).forEach(({ file, total }) => {
        out.push(`- ${short(file)} -> ${total}`);
      });
      if (ranked.length > 5) out.push(`- ...and ${ranked.length - 5} more`);
    }
  } catch {
    // Graph na bane to summary ke bina hi chalo — commit message rokna nahi hai.
    out.push('');
    out.push('Blast radius: could not be computed (dependency graph failed).');
  }
}

console.log(out.join('\n'));
