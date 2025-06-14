# CI/CD Troubleshooting Guide

## Common Issues and Solutions

### Issue: `npm ERR! Cannot read property 'axios' of undefined`

**Cause:** Corrupted `package-lock.json` or dependency resolution issues.

**Solutions:**
1. **Regenerate lock file:**
   ```bash
   rm package-lock.json
   npm install
   git add package-lock.json
   git commit -m "Regenerate package-lock.json"
   ```

2. **Clear npm cache:**
   ```bash
   npm cache clean --force
   npm install
   ```

### Issue: `Dependencies lock file is not found`

**Cause:** `package-lock.json` is in `.gitignore` or not committed.

**Solution:**
1. Remove `package-lock.json` from `.gitignore`
2. Commit the lock file:
   ```bash
   git add package-lock.json
   git commit -m "Include package-lock.json for reproducible builds"
   ```

### Issue: Tests failing in CI but passing locally

**Cause:** Environment differences or API rate limits.

**Solutions:**
1. **Check Node.js version compatibility**
2. **Use environment variables for API tests**
3. **Make integration tests optional in CI**

## Current CI Configuration

- **Node.js versions tested:** 16.x, 18.x, 20.x
- **Strategy:** Unit tests must pass, integration tests allowed to fail
- **Caching:** Disabled to avoid lock file issues
- **Security:** Dependencies are audited and fixed automatically

## Manual Testing Before Push

```bash
# Test unit tests (fast)
npm run test:unit

# Test integration tests (may fail due to API limits)
npm run test:integration

# Validate package
npm run validate

# Test publishing (dry run)
npm publish --dry-run
```

## CI Workflow Steps

1. **Checkout** - Get latest code
2. **Setup Node.js** - Install specified Node version
3. **Clear cache** - Prevent stale dependency issues
4. **Install dependencies** - Use `npm install` (more flexible than `npm ci`)
5. **Run unit tests** - Must pass for build to succeed
6. **Run integration tests** - Allowed to fail due to API limitations
7. **Publish** (only on releases) - Validate then publish to npm

## Environment Variables

Set these in GitHub repository secrets:
- `NPM_TOKEN` - Your npm authentication token for publishing

## Notes

- Integration tests may fail due to Free transfer API rate limits or changes
- This is expected and won't block the CI pipeline
- Unit tests provide the primary validation
