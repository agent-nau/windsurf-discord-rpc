"use strict";
// Language ID to Discord Rich Presence asset key mapping
// These keys MUST match the asset names uploaded to your Discord application
// Based on user's assets: bash, code, cplusplus, css, docker, go, html, idle, 
// java, javascript, json, markdown, python, rust, sql, supabase, tailwindcss, 
// typescript, vitejs, windsurf
Object.defineProperty(exports, "__esModule", { value: true });
exports.FILE_EXTENSION_ASSETS = exports.LANGUAGE_ASSETS = void 0;
exports.getAssetFromFilename = getAssetFromFilename;
exports.getLanguageAsset = getLanguageAsset;
exports.getLanguageDisplayName = getLanguageDisplayName;
exports.LANGUAGE_ASSETS = {
    // === YOUR DISCORD ASSETS (exact names from screenshot) ===
    // Core / Fallbacks
    'default': 'code',
    'code': 'code',
    'idle': 'idle',
    'windsurf': 'windsurf',
    // Web
    'html': 'html',
    'css': 'css',
    'scss': 'css',
    'sass': 'css',
    'less': 'css',
    'javascript': 'javascript',
    'javascriptreact': 'javascript',
    'typescript': 'typescript',
    'typescriptreact': 'typescript',
    'json': 'json',
    'jsonc': 'json',
    // Frameworks / Tools (YOUR CUSTOM ASSETS)
    'vite': 'vitejs',
    'vue': 'code',
    'svelte': 'code',
    'react': 'javascript',
    'angular': 'typescript',
    'tailwindcss': 'tailwindcss',
    'tailwind': 'tailwindcss',
    // Programming Languages
    'python': 'python',
    'java': 'java',
    'kotlin': 'java',
    'scala': 'java',
    'groovy': 'java',
    'clojure': 'java',
    'csharp': 'cplusplus',
    'fsharp': 'cplusplus',
    'vb': 'code',
    'cpp': 'cplusplus',
    'c': 'cplusplus',
    'objc': 'cplusplus',
    'objective-c': 'cplusplus',
    'swift': 'cplusplus',
    'go': 'go',
    'rust': 'rust',
    'ruby': 'code',
    'perl': 'code',
    'php': 'code',
    'r': 'code',
    'dart': 'code',
    'lua': 'code',
    'elixir': 'code',
    'erlang': 'code',
    'haskell': 'code',
    'ocaml': 'code',
    'julia': 'code',
    'matlab': 'code',
    'fortran': 'code',
    'cobol': 'code',
    'pascal': 'code',
    'delphi': 'code',
    // Shell / Scripting
    'shellscript': 'bash',
    'bash': 'bash',
    'zsh': 'bash',
    'fish': 'bash',
    'powershell': 'code',
    'cmd': 'code',
    'batch': 'code',
    // Data / Config
    'yaml': 'code',
    'yml': 'code',
    'toml': 'code',
    'ini': 'code',
    'cfg': 'code',
    'sql': 'sql',
    'graphql': 'code',
    // Markup / Documentation
    'markdown': 'markdown',
    'mdx': 'markdown',
    'latex': 'code',
    'tex': 'code',
    'plaintext': 'code',
    'text': 'code',
    'log': 'code',
    // Other
    'dockerfile': 'docker',
    'dockercompose': 'docker',
    'nginx': 'code',
    'vagrant': 'code',
    'terraform': 'code',
    'ansible': 'code',
    'cmake': 'code',
    'makefile': 'code',
    'gradle': 'code',
    'maven': 'code',
    'jupyter': 'code',
    'rmarkdown': 'code',
    // Your custom assets
    'supabase': 'supabase',
    // Game Dev
    'unity': 'code',
    'csharp unity': 'code',
    'unreal': 'cplusplus',
    // AI / ML
    'jupyter-notebook': 'code',
    'ipynb': 'code',
};
// === FILE EXTENSION TO ASSET MAPPING (for config files) ===
// These take PRIORITY over language detection
exports.FILE_EXTENSION_ASSETS = {
    // Vite
    'vite.config.ts': 'vitejs',
    'vite.config.js': 'vitejs',
    'vite.config.mjs': 'vitejs',
    'vite.config.cjs': 'vitejs',
    'vite.config.mts': 'vitejs',
    // Tailwind
    'tailwind.config.js': 'tailwindcss',
    'tailwind.config.ts': 'tailwindcss',
    'tailwind.config.cjs': 'tailwindcss',
    'tailwind.config.mjs': 'tailwindcss',
    'tailwind.config.mts': 'tailwindcss',
    // Supabase
    'supabase.config.ts': 'supabase',
    'supabase.config.js': 'supabase',
    'supabase.toml': 'supabase',
    // Docker
    'dockerfile': 'docker',
    'docker-compose.yml': 'docker',
    'docker-compose.yaml': 'docker',
    'compose.yml': 'docker',
    'compose.yaml': 'docker',
    // Package managers
    'package.json': 'json',
    'package-lock.json': 'json',
    'yarn.lock': 'json',
    'pnpm-lock.yaml': 'json',
    'bun.lockb': 'json',
    // Git
    '.gitignore': 'bash',
    '.gitattributes': 'bash',
    // Env
    '.env': 'bash',
    '.env.local': 'bash',
    '.env.production': 'bash',
    '.env.development': 'bash',
    '.env.example': 'bash',
    // README
    'readme.md': 'markdown',
    'readme.markdown': 'markdown',
    'contributing.md': 'markdown',
    'license': 'markdown',
    'license.md': 'markdown',
    'changelog.md': 'markdown',
    // CI/CD
    '.github/workflows': 'code',
    '.gitlab-ci.yml': 'code',
    // Build tools
    'tsconfig.json': 'typescript',
    'jsconfig.json': 'javascript',
    'webpack.config.js': 'code',
    'rollup.config.js': 'code',
    'esbuild.config.js': 'code',
    // Database
    'schema.sql': 'sql',
    'dump.sql': 'sql',
    'seed.sql': 'sql',
    '.prisma': 'sql',
    'prisma.schema': 'sql',
};
// === DETECT ASSET FROM FILENAME ===
// Returns the Discord asset name or undefined
function getAssetFromFilename(filename) {
    const lower = filename.toLowerCase();
    const basename = lower.split(/[\\/]/).pop() || '';
    // Check exact basename matches first
    if (exports.FILE_EXTENSION_ASSETS[basename]) {
        return exports.FILE_EXTENSION_ASSETS[basename];
    }
    // Check for patterns in filename
    if (basename.includes('vite.config'))
        return 'vitejs';
    if (basename.includes('tailwind.config'))
        return 'tailwindcss';
    if (basename.includes('supabase.config'))
        return 'supabase';
    if (basename.includes('supabase.toml'))
        return 'supabase';
    if (basename === 'dockerfile' || basename.includes('docker-compose') || basename.includes('compose.yml'))
        return 'docker';
    if (basename.includes('.env'))
        return 'bash';
    if (basename.includes('readme'))
        return 'markdown';
    if (basename.includes('license'))
        return 'markdown';
    if (basename.includes('changelog'))
        return 'markdown';
    if (basename.includes('contributing'))
        return 'markdown';
    if (basename.includes('tsconfig'))
        return 'typescript';
    if (basename.includes('jsconfig'))
        return 'javascript';
    if (basename.endsWith('.sql'))
        return 'sql';
    if (basename.endsWith('.prisma'))
        return 'sql';
    if (basename === 'schema.prisma')
        return 'sql';
    return undefined;
}
// Get asset key for a language ID
function getLanguageAsset(languageId) {
    return exports.LANGUAGE_ASSETS[languageId.toLowerCase()] || exports.LANGUAGE_ASSETS['default'];
}
// Get display name for a language
function getLanguageDisplayName(languageId) {
    const displayNames = {
        'javascript': 'JavaScript',
        'typescript': 'TypeScript',
        'javascriptreact': 'React',
        'typescriptreact': 'React',
        'python': 'Python',
        'java': 'Java',
        'cpp': 'C++',
        'c': 'C',
        'csharp': 'C#',
        'go': 'Go',
        'rust': 'Rust',
        'ruby': 'Ruby',
        'php': 'PHP',
        'swift': 'Swift',
        'kotlin': 'Kotlin',
        'dart': 'Dart',
        'html': 'HTML',
        'css': 'CSS',
        'scss': 'SCSS',
        'json': 'JSON',
        'yaml': 'YAML',
        'markdown': 'Markdown',
        'shellscript': 'Shell',
        'bash': 'Bash',
        'powershell': 'PowerShell',
        'sql': 'SQL',
        'dockerfile': 'Docker',
        'dockercompose': 'Docker Compose',
        'vite': 'Vite',
        'vue': 'Vue',
        'svelte': 'Svelte',
        'react': 'React',
        'angular': 'Angular',
        'tailwindcss': 'Tailwind CSS',
        'tailwind': 'Tailwind CSS',
        'supabase': 'Supabase',
        'graphql': 'GraphQL',
        'terraform': 'Terraform',
        'ansible': 'Ansible',
        'nginx': 'Nginx',
        'gradle': 'Gradle',
        'git': 'Git',
        'github': 'GitHub',
        'gitlab': 'GitLab',
        'vim': 'Vim',
        'neovim': 'Neovim',
        'vscode': 'VS Code',
        'unity': 'Unity',
        'godot': 'Godot',
        'blender': 'Blender',
        'latex': 'LaTeX',
        'firebase': 'Firebase',
        'mongodb': 'MongoDB',
        'redis': 'Redis',
        'webpack': 'Webpack',
        'babel': 'Babel',
        'eslint': 'ESLint',
        'prettier': 'Prettier',
        'jest': 'Jest',
        'kubernetes': 'Kubernetes',
    };
    return displayNames[languageId.toLowerCase()] ||
        languageId.charAt(0).toUpperCase() + languageId.slice(1);
}
//# sourceMappingURL=languages.js.map