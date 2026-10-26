#!/usr/bin/env node
// Mechanical checks on a piece's post copy (pieces/<slug>/post.md).
// The judgement checks (pillar, ICP, owns-vs-orchestrates, mic drop) stay with the
// linkedin-post rubric; this catches what a script can.
// usage: node tools/post-check.mjs pieces/<slug>
import fs from 'node:fs';
import path from 'node:path';

const dir = process.argv[2];
if (!dir) { console.error('usage: node tools/post-check.mjs pieces/<slug>'); process.exit(2); }
const md = fs.readFileSync(path.join(dir, 'post.md'), 'utf8');
const briefPath = path.join(dir, 'brief.md');
const brief = fs.existsSync(briefPath) ? fs.readFileSync(briefPath, 'utf8') : '';

// the text under a "## <name>" heading, up to the next "## "
const section = (name) => {
  const m = md.match(new RegExp(`^## ${name}[^\\n]*\\n([\\s\\S]*?)(?=^## |(?![\\s\\S]))`, 'm'));
  return m ? m[1].replace(/<!--[\s\S]*?-->/g, '').trim() : '';
};

const post = section('Post');
const hooks = section('Hook options').split('\n').filter((l) => /^\s*\d+\.\s+\S/.test(l));
const rows = [];
const check = (name, ok, detail) => rows.push({ name, ok, detail });

check('post written', post.length > 0, post ? '' : 'the "## Post" section is empty');
check('length 800-1,400', post.length >= 800 && post.length <= 1400, `${post.length} characters`);
check('no em dashes', !/[—–]/.test(post), (post.match(/[—–]/g) || []).length + ' found');
check('three hook options', hooks.length >= 3, `${hooks.length} found`);

// the hook is the first paragraph; LinkedIn cuts at about 210 characters
const hook = post.split(/\n\s*\n/)[0] || '';
check('hook fits before "see more"', hook.length <= 210, `${hook.length} characters in the first paragraph`);

// every figure in the post should appear in the brief, where its source is
const figures = [...new Set(post.match(/\d[\d,.]*%?/g) || [])].filter((f) => f.replace(/\D/g, '').length > 0 && !/^[1-9]\.$/.test(f));
const missing = figures.filter((f) => !brief.includes(f.replace(/[.,]$/, '')));
check('figures sourced in brief', missing.length === 0, missing.length ? 'not in brief.md: ' + missing.join(', ') : `${figures.length} figures`);

for (const r of rows) console.log(`${r.ok ? 'PASS' : 'FAIL'}  ${r.name}${r.detail ? '  (' + r.detail + ')' : ''}`);
process.exit(rows.every((r) => r.ok) ? 0 : 1);
