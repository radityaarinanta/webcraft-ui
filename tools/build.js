import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

export function build() {
  const distDir = path.join(rootDir, 'dist');
  const docsDir = path.join(rootDir, 'docs');
  
  if (!fs.existsSync(distDir)) fs.mkdirSync(distDir, { recursive: true });

  const tokensCss = fs.readFileSync(path.join(rootDir, 'src', 'styles', 'tokens.css'), 'utf8');
  const resetCss = fs.readFileSync(path.join(rootDir, 'src', 'styles', 'reset.css'), 'utf8');

  let componentsCss = '';
  const componentsDir = path.join(rootDir, 'src', 'components');
  if (fs.existsSync(componentsDir)) {
    const comps = fs.readdirSync(componentsDir).filter(f => fs.statSync(path.join(componentsDir, f)).isDirectory());
    comps.forEach(comp => {
      const cssFile = path.join(componentsDir, comp, `${comp}.css`);
      if (fs.existsSync(cssFile)) {
        componentsCss += '\n' + fs.readFileSync(cssFile, 'utf8');
      }
    });
  }

  const bundleCss = `${tokensCss}\n${resetCss}\n${componentsCss}`.trim();
  fs.writeFileSync(path.join(distDir, 'webcraft.css'), bundleCss, 'utf8');
  fs.writeFileSync(path.join(docsDir, 'webcraft.css'), bundleCss, 'utf8');

  let jsModules = [];
  let exportInits = [];
  let exportClasses = [];

  if (fs.existsSync(componentsDir)) {
    const comps = fs.readdirSync(componentsDir).filter(f => fs.statSync(path.join(componentsDir, f)).isDirectory());
    comps.forEach(comp => {
      const jsFile = path.join(componentsDir, comp, `${comp}.js`);
      if (fs.existsSync(jsFile)) {
        const content = fs.readFileSync(jsFile, 'utf8');
        jsModules.push(content.replace(/export /g, ''));
        
        const initMatches = content.match(/export function (init\w+)/g);
        if (initMatches) {
          initMatches.forEach(m => exportInits.push(m.replace('export function ', '')));
        }
        const classMatches = content.match(/export class (\w+)/g);
        if (classMatches) {
          classMatches.forEach(m => exportClasses.push(m.replace('export class ', '')));
        }
      }
    });
  }

  const bundleJs = `
${jsModules.join('\n\n')}

export function initWebCraft() {
  ${exportInits.map(fn => `${fn}();`).join('\n  ')}
}

export {
  ${[...exportClasses, ...exportInits].join(',\n  ')}
};

if (typeof window !== 'undefined') {
  window.WebCraft = {
    init: initWebCraft,
    ${exportClasses.join(',\n    ')}
  };
}
`.trim();

  fs.writeFileSync(path.join(distDir, 'webcraft.js'), bundleJs, 'utf8');
  fs.writeFileSync(path.join(docsDir, 'webcraft.js'), bundleJs, 'utf8');
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  build();
  console.log('[Build] Successfully generated webcraft.css and webcraft.js in dist/ and docs/');
}
