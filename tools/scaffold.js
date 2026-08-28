import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

loadEnv();

const catalogPath = path.join(rootDir, 'tools', 'catalog.json');
const catalog = JSON.parse(fs.readFileSync(catalogPath, 'utf8'));

const args = process.argv.slice(2);
const isList = args.includes('--list');
const isDryRun = args.includes('--dry-run');
const isLocal = args.includes('--local');
const targetIdArg = args.find(a => a.startsWith('--id='))?.split('=')[1];

main().catch(err => {
  console.error('[Error]:', err.message);
  process.exit(1);
});

async function main() {
  const installedIds = getInstalledComponentIds();

  if (isList) {
    console.log('Available WebCraft UI Components:\n');
    catalog.forEach(comp => {
      const isInstalled = installedIds.includes(comp.id);
      const status = isInstalled ? '[Installed]' : '[Available]';
      console.log(`- ${comp.id.padEnd(20)} ${status} ${comp.name} (${comp.category})`);
    });
    return;
  }

  let targetComp;
  if (targetIdArg) {
    targetComp = catalog.find(c => c.id === targetIdArg);
    if (!targetComp) {
      throw new Error(`Component with ID "${targetIdArg}" not found in catalog.`);
    }
  } else {
    targetComp = catalog.find(c => !installedIds.includes(c.id));
    if (!targetComp) {
      console.log('All catalog components are currently installed.');
      return;
    }
  }

  console.log(`Selected component: ${targetComp.name} (${targetComp.id})`);

  if (isDryRun) {
    console.log('[Dry Run] Plan:');
    console.log(`- Issue Title: ${targetComp.issueTitle}`);
    console.log(`- Branch Name: ${targetComp.branchName}`);
    console.log(`- Commit Message: ${targetComp.commitMsg}`);
    console.log(`- PR Title: ${targetComp.prTitle}`);
    console.log(`- Target Directory: src/components/${targetComp.id}`);
    return;
  }

  const token = process.env.GITHUB_TOKEN;
  const repo = process.env.GITHUB_REPO;

  if (isLocal || !token || !repo) {
    if (!isLocal && (!token || !repo)) {
      console.log('GITHUB_TOKEN or GITHUB_REPO not detected in environment. Running in local mode.');
    }
    applyComponentFiles(targetComp);
    console.log(`[Success] Component "${targetComp.name}" scaffolded locally.`);
    return;
  }

  await runRemoteWorkflow(targetComp, token, repo);
}

function getInstalledComponentIds() {
  const compDir = path.join(rootDir, 'src', 'components');
  if (!fs.existsSync(compDir)) return [];
  return fs.readdirSync(compDir).filter(name => {
    return fs.statSync(path.join(compDir, name)).isDirectory();
  });
}

function applyComponentFiles(comp) {
  const compDir = path.join(rootDir, 'src', 'components', comp.id);
  if (!fs.existsSync(compDir)) {
    fs.mkdirSync(compDir, { recursive: true });
  }

  const cssPath = path.join(compDir, `${comp.id}.css`);
  const jsPath = path.join(compDir, `${comp.id}.js`);

  fs.writeFileSync(cssPath, comp.css.trim() + '\n', 'utf8');
  fs.writeFileSync(jsPath, comp.js.trim() + '\n', 'utf8');

  updateDocsCss(comp.id);
  updateDocsHtml(comp);
}

function updateDocsCss(compId) {
  const docsCssPath = path.join(rootDir, 'docs', 'docs.css');
  let docsCss = fs.readFileSync(docsCssPath, 'utf8');
  const importLine = `@import url('../src/components/${compId}/${compId}.css');`;

  if (!docsCss.includes(importLine)) {
    const lines = docsCss.split('\n');
    let lastImportIdx = -1;
    lines.forEach((l, i) => {
      if (l.startsWith('@import')) lastImportIdx = i;
    });

    if (lastImportIdx !== -1) {
      lines.splice(lastImportIdx + 1, 0, importLine);
      fs.writeFileSync(docsCssPath, lines.join('\n'), 'utf8');
    }
  }
}

function updateDocsHtml(comp) {
  const docsHtmlPath = path.join(rootDir, 'docs', 'index.html');
  let html = fs.readFileSync(docsHtmlPath, 'utf8');

  const navItemHtml = `          <a href="#${comp.id}" class="docs-nav-item">\n            <span>${comp.name}</span>\n            <span class="docs-nav-count">${comp.category}</span>\n          </a>`;
  if (!html.includes(`href="#${comp.id}"`)) {
    const navMarker = '<div class="docs-sidebar-section-title">Components</div>\n        <div class="docs-nav-list">';
    if (html.includes(navMarker)) {
      html = html.replace(navMarker, navMarker + '\n' + navItemHtml);
    }
  }

  const sectionHtml = `
      <section id="${comp.id}" class="docs-component-section">
        <div class="docs-section-header">
          <div>
            <h2 class="docs-section-title">${comp.name}</h2>
            <p class="docs-section-desc">${comp.issueTitle}</p>
          </div>
        </div>

        <div class="docs-preview-card">
          <div class="docs-card-header">
            <div class="docs-tabs">
              <button class="docs-tab-btn is-active" data-tab="preview">Preview</button>
              <button class="docs-tab-btn" data-tab="code">HTML / CSS</button>
            </div>
            <button class="docs-copy-btn" aria-label="Copy code">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
              </svg>
              <span>Copy</span>
            </button>
          </div>

          <div class="docs-preview-area">
            ${comp.preview}
          </div>

          <div class="docs-code-area">
<pre><code>${escapeHtml(comp.preview)}</code></pre>
          </div>
        </div>
      </section>`;

  if (!html.includes(`id="${comp.id}"`)) {
    const mainEndMarker = '</main>';
    if (html.includes(mainEndMarker)) {
      html = html.replace(mainEndMarker, sectionHtml + '\n    ' + mainEndMarker);
    }
  }

  fs.writeFileSync(docsHtmlPath, html, 'utf8');
}

function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

async function runRemoteWorkflow(comp, token, repo) {
  console.log(`[1/6] Creating GitHub Issue for: ${comp.name}...`);
  const issue = await githubApi(`/repos/${repo}/issues`, 'POST', token, {
    title: comp.issueTitle,
    body: comp.issueBody,
    labels: ['enhancement', comp.category]
  });
  console.log(`Issue created: #${issue.number} - ${issue.title}`);

  const defaultBranch = 'main';
  const branchName = comp.branchName;

  console.log(`[2/6] Preparing branch: ${branchName}...`);
  execGit(`checkout ${defaultBranch}`);
  execGit(`pull origin ${defaultBranch}`);
  execGit(`checkout -B ${branchName}`);

  console.log(`[3/6] Generating component source files...`);
  applyComponentFiles(comp);

  console.log(`[4/6] Committing changes...`);
  execGit(`add .`);
  const userName = process.env.GIT_USER_NAME;
  const userEmail = process.env.GIT_USER_EMAIL;
  if (userName) execGit(`config user.name "${userName}"`);
  if (userEmail) execGit(`config user.email "${userEmail}"`);

  execGit(`commit -m "${comp.commitMsg}"`);
  execGit(`push origin ${branchName} --force`);

  console.log(`[5/6] Opening Pull Request...`);
  const prBody = comp.prBody.replace('#ISSUE_ID', `#${issue.number}`);
  const pr = await githubApi(`/repos/${repo}/pulls`, 'POST', token, {
    title: comp.prTitle,
    head: branchName,
    base: defaultBranch,
    body: prBody
  });
  console.log(`Pull Request created: #${pr.number} - ${pr.title}`);

  console.log(`[6/6] Merging Pull Request #${pr.number}...`);
  await githubApi(`/repos/${repo}/pulls/${pr.number}/merge`, 'PUT', token, {
    commit_title: `${comp.prTitle} (#${pr.number})`,
    merge_method: 'squash'
  });

  execGit(`checkout ${defaultBranch}`);
  execGit(`pull origin ${defaultBranch}`);
  execGit(`branch -D ${branchName}`);
  try {
    execGit(`push origin --delete ${branchName}`);
  } catch (err) {}

  console.log(`[Complete] Successfully published component ${comp.name} with linked Issue #${issue.number} and PR #${pr.number}.`);
}

function execGit(cmd) {
  try {
    return execSync(`git ${cmd}`, { cwd: rootDir, encoding: 'utf8', stdio: 'pipe' });
  } catch (err) {
    throw new Error(`Git command failed: git ${cmd}\n${err.stderr || err.message}`);
  }
}

async function githubApi(endpoint, method, token, data) {
  const url = `https://api.github.com${endpoint}`;
  const options = {
    method,
    headers: {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/vnd.github.v3+json',
      'User-Agent': 'WebCraft-Scaffold',
      'Content-Type': 'application/json'
    }
  };

  if (data) {
    options.body = JSON.stringify(data);
  }

  const res = await fetch(url, options);
  const json = await res.json();
  if (!res.ok) {
    throw new Error(`GitHub API Error (${res.status}): ${json.message || JSON.stringify(json)}`);
  }
  return json;
}

function loadEnv() {
  const envPath = path.join(rootDir, '.env');
  if (fs.existsSync(envPath)) {
    const lines = fs.readFileSync(envPath, 'utf8').split('\n');
    lines.forEach(line => {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith('#')) {
        const [k, ...v] = trimmed.split('=');
        if (k && v.length) {
          process.env[k.trim()] = v.join('=').trim();
        }
      }
    });
  }
}
