# Publishing Guide

This document outlines the steps to publish the `free-transfert` package to GitHub and npm.

## 📋 Pre-Publication Checklist

- [x] Package.json is properly configured
- [x] README.md is comprehensive with examples
- [x] TypeScript declarations are included
- [x] LICENSE file is present (MIT)
- [x] .gitignore and .npmignore are configured
- [x] Examples work correctly
- [x] CHANGELOG.md is up to date
- [x] GitHub Actions workflow is configured

## 🐙 GitHub Publishing

### 1. Initialize Git Repository

```bash
cd z:\Projets\free-transfert
git init
git add .
git commit -m "Initial commit: Free Transfer Node.js library"
```

### 2. Create GitHub Repository

1. Go to [GitHub](https://github.com) and create a new repository named `free-transfert`
2. **Don't** initialize with README, .gitignore, or license (we already have these)

### 3. Connect and Push

```bash
# Replace 'yourusername' with your actual GitHub username
git remote add origin https://github.com/yourusername/free-transfert.git
git branch -M main
git push -u origin main
```

### 4. Update Package.json URLs

After creating the GitHub repository, update the URLs in `package.json`:

```json
{
  "repository": {
    "type": "git",
    "url": "git+https://github.com/yourusername/free-transfert.git"
  },
  "bugs": {
    "url": "https://github.com/yourusername/free-transfert/issues"
  },
  "homepage": "https://github.com/yourusername/free-transfert#readme"
}
```

## 📦 NPM Publishing

### 1. Create NPM Account

If you don't have one, create an account at [npmjs.com](https://www.npmjs.com/)

### 2. Login to NPM

```bash
npm login
```

### 3. Check Package Name Availability

```bash
npm view free-transfert
```

If the package name is taken, you might need to:
- Use a scoped package: `@yourusername/free-transfert`
- Choose a different name: `freetransfert-client`, `free-transfer-js`, etc.

### 4. Publish the Package

```bash
# Dry run to see what would be published
npm publish --dry-run

# Actual publish
npm publish
```

### 5. For Scoped Packages (if needed)

If you need to use a scoped package:

```bash
# Update package.json name to "@yourusername/free-transfert"
# Then publish with public access
npm publish --access public
```

## 🚀 GitHub Actions Setup

The repository includes a GitHub Actions workflow that will:
- Test the package on multiple Node.js versions
- Automatically publish to npm when you create a GitHub release

### Setting up NPM Token for Auto-Publishing

1. Go to npmjs.com → Account → Access Tokens
2. Generate a new **Automation** token
3. Go to your GitHub repository → Settings → Secrets and variables → Actions
4. Add a new secret named `NPM_TOKEN` with your npm token value

## 📈 Creating Releases

### Using GitHub UI

1. Go to your repository on GitHub
2. Click "Releases" → "Create a new release"
3. Create a new tag (e.g., `v1.0.0`)
4. Add release notes from CHANGELOG.md
5. Publish the release

This will trigger the GitHub Action to automatically publish to npm.

### Using Git Tags

```bash
# Create and push a tag
git tag v1.0.0
git push origin v1.0.0

# Then create the release on GitHub
```

## 🔄 Updating the Package

For future updates:

1. Update the version in `package.json`
2. Update `CHANGELOG.md`
3. Commit changes
4. Create a new release/tag

### Semantic Versioning

- **Patch** (1.0.1): Bug fixes
- **Minor** (1.1.0): New features (backward compatible)
- **Major** (2.0.0): Breaking changes

```bash
# Update version automatically
npm version patch  # 1.0.0 → 1.0.1
npm version minor  # 1.0.0 → 1.1.0
npm version major  # 1.0.0 → 2.0.0
```

## 📊 Post-Publication

After publishing:

1. ✅ Verify the package appears on npmjs.com: https://www.npmjs.com/package/free-transfert
2. ✅ Test installation: `npm install free-transfert`
3. ✅ Check GitHub repository has all files
4. ✅ Update any documentation with the correct installation command
5. ✅ Consider adding the package to relevant lists/directories

## 🔧 Troubleshooting

### Common Issues

**"Package name already exists"**
- Use a scoped package: `@yourusername/free-transfert`
- Choose a different name

**"You must be logged in to publish"**
- Run `npm login` and enter your credentials

**"403 Forbidden"**
- Make sure you have publishing rights
- For scoped packages, use `--access public`

**GitHub Actions failing**
- Check that `NPM_TOKEN` secret is correctly set
- Ensure the token has automation permissions

## 🎉 Success!

Once published, users can install your package with:

```bash
npm install free-transfert
```

And use it in their projects:

```javascript
import FreeTransfer from 'free-transfert';

const transfer = new FreeTransfer({
    path: './file.txt',
    availability: 14
});

const result = await transfer.upload();
console.log('Download URL:', result.downloadUrl);
```
