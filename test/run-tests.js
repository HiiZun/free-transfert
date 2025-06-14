#!/usr/bin/env node

import { spawn } from 'child_process';
import { readdir } from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const colors = {
    green: '\x1b[32m',
    red: '\x1b[31m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m',
    cyan: '\x1b[36m',
    reset: '\x1b[0m',
    bold: '\x1b[1m'
};

async function runTests(testDir, label) {
    console.log(`${colors.bold}${colors.blue}Running ${label}...${colors.reset}\n`);
    
    try {
        const testFiles = await readdir(path.join(__dirname, testDir));
        const jsFiles = testFiles.filter(file => file.endsWith('.test.js'));
        
        if (jsFiles.length === 0) {
            console.log(`${colors.yellow}No test files found in ${testDir}${colors.reset}\n`);
            return true;
        }
        
        let allPassed = true;
        
        for (const file of jsFiles) {
            const testPath = path.join(__dirname, testDir, file);
            console.log(`${colors.cyan}  Running ${file}...${colors.reset}`);
            
            try {
                await runTestFile(testPath);
                console.log(`${colors.green}    ✅ PASSED${colors.reset}`);
            } catch (error) {
                console.log(`${colors.red}    ❌ FAILED: ${error.message}${colors.reset}`);
                allPassed = false;
            }
        }
        
        console.log();
        return allPassed;
    } catch (error) {
        console.error(`${colors.red}Error reading test directory ${testDir}: ${error.message}${colors.reset}`);
        return false;
    }
}

function runTestFile(testPath) {
    return new Promise((resolve, reject) => {
        const child = spawn('node', [testPath], {
            stdio: 'pipe',
            cwd: path.dirname(__dirname) // Run from project root
        });
        
        let stdout = '';
        let stderr = '';
        
        child.stdout.on('data', (data) => {
            stdout += data.toString();
        });
        
        child.stderr.on('data', (data) => {
            stderr += data.toString();
        });
        
        child.on('close', (code) => {
            if (code === 0) {
                resolve({ stdout, stderr });
            } else {
                reject(new Error(stderr || `Exit code: ${code}`));
            }
        });
        
        child.on('error', (error) => {
            reject(error);
        });
    });
}

async function main() {
    const args = process.argv.slice(2);
    const testType = args[0];
    
    console.log(`${colors.bold}${colors.magenta}🧪 Free Transfer Test Runner${colors.reset}\n`);
    
    let unitPassed = true;
    let integrationPassed = true;
    
    if (!testType || testType === 'unit') {
        unitPassed = await runTests('unit', 'Unit Tests');
    }
    
    if (!testType || testType === 'integration') {
        integrationPassed = await runTests('integration', 'Integration Tests');
    }
    
    if (testType && !['unit', 'integration'].includes(testType)) {
        console.error(`${colors.red}Invalid test type: ${testType}. Use 'unit' or 'integration'.${colors.reset}`);
        process.exit(1);
    }
    
    // Summary
    console.log(`${colors.bold}📊 Test Summary:${colors.reset}`);
    if (!testType || testType === 'unit') {
        console.log(`  Unit Tests: ${unitPassed ? colors.green + '✅ PASSED' : colors.red + '❌ FAILED'}${colors.reset}`);
    }
    if (!testType || testType === 'integration') {
        console.log(`  Integration Tests: ${integrationPassed ? colors.green + '✅ PASSED' : colors.red + '❌ FAILED'}${colors.reset}`);
    }
    
    const allPassed = unitPassed && integrationPassed;
    
    if (allPassed) {
        console.log(`\n${colors.bold}${colors.green}🎉 All tests passed!${colors.reset}`);
        process.exit(0);
    } else {
        console.log(`\n${colors.bold}${colors.red}💥 Some tests failed!${colors.reset}`);
        process.exit(1);
    }
}

// Handle CLI usage
if (process.argv[1] === __filename) {
    main().catch(error => {
        console.error(`${colors.red}Test runner error: ${error.message}${colors.reset}`);
        process.exit(1);
    });
}
