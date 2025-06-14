#!/usr/bin/env node

// Package validation script
import fs from 'fs';
import path from 'path';

console.log('🔍 Validating package for publication...\n');

const checks = [
  {
    name: 'package.json exists',
    check: () => fs.existsSync('package.json'),
    fix: 'Create a package.json file'
  },
  {
    name: 'README.md exists',
    check: () => fs.existsSync('README.md'),
    fix: 'Create a README.md file'
  },
  {
    name: 'LICENSE exists',
    check: () => fs.existsSync('LICENSE'),
    fix: 'Create a LICENSE file'
  },
  {
    name: 'Main entry point exists',
    check: () => {
      const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
      return fs.existsSync(pkg.main || 'index.js');
    },
    fix: 'Ensure the main entry point file exists'
  },
  {
    name: 'TypeScript declarations exist',
    check: () => fs.existsSync('lib/index.d.ts'),
    fix: 'Create TypeScript declaration files'
  },
  {
    name: '.gitignore exists',
    check: () => fs.existsSync('.gitignore'),
    fix: 'Create a .gitignore file'
  },
  {
    name: '.npmignore exists',
    check: () => fs.existsSync('.npmignore'),
    fix: 'Create a .npmignore file'
  },  {
    name: 'Test directory structure exists',
    check: () => {
      return fs.existsSync('test/unit') && 
             fs.existsSync('test/integration') && 
             fs.existsSync('test/fixtures');
    },
    fix: 'Create test/unit, test/integration, and test/fixtures directories'
  },
  {
    name: 'Unit tests exist',
    check: () => fs.existsSync('test/unit/constructor.test.js'),
    fix: 'Create unit test files in test/unit/'
  },
  {
    name: 'Integration test suite exists',
    check: () => fs.existsSync('test/integration/suite.test.js'),
    fix: 'Create test/integration/suite.test.js file'
  },
  {
    name: 'Test runner exists',
    check: () => fs.existsSync('test/run-tests.js'),
    fix: 'Create test/run-tests.js file'
  },
  {
    name: 'CHANGELOG.md exists',
    check: () => fs.existsSync('CHANGELOG.md'),
    fix: 'Create a CHANGELOG.md file'
  },
];

let allPassed = true;

checks.forEach(({ name, check, fix }) => {
  const passed = check();
  const status = passed ? '✅' : '❌';
  console.log(`${status} ${name}`);
  
  if (!passed) {
    console.log(`   → ${fix}`);
    allPassed = false;
  }
});

console.log('\n' + '='.repeat(50));

if (allPassed) {
  console.log('🎉 All checks passed! Package is ready for publication.');
  console.log('\nNext steps:');
  console.log('1. Review PUBLISHING.md for detailed instructions');
  console.log('2. Test with: npm publish --dry-run');
  console.log('3. Publish with: npm publish');
} else {
  console.log('❌ Some checks failed. Please fix the issues above.');
  process.exit(1);
}

// Additional package.json validation
try {
  const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  
  console.log('\n📋 Package Information:');
  console.log(`   Name: ${pkg.name}`);
  console.log(`   Version: ${pkg.version}`);
  console.log(`   Description: ${pkg.description}`);
  console.log(`   Author: ${pkg.author}`);
  console.log(`   License: ${pkg.license}`);
  
  if (!pkg.name) console.log('⚠️  Warning: Package name is missing');
  if (!pkg.version) console.log('⚠️  Warning: Package version is missing');
  if (!pkg.description) console.log('⚠️  Warning: Package description is missing');
  if (!pkg.author) console.log('⚠️  Warning: Package author is missing');
  if (!pkg.license) console.log('⚠️  Warning: Package license is missing');
  
} catch (error) {
  console.log('❌ Error reading package.json:', error.message);
}
