#!/usr/bin/env node
const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

console.log('🔍 Verifying n8n-nodes-pirate-weather setup...\n');

let hasErrors = false;

// Check if n8n is installed
try {
    const version = execSync('n8n --version').toString().trim();
    console.log(`✅ n8n is installed (version ${version})`);
} catch (e) {
    console.log('❌ n8n is not installed globally');
    console.log('   Run: npm install -g n8n');
    hasErrors = true;
}

// Check if the package is built
const distPath = path.join(__dirname, '..', 'dist');
if (fs.existsSync(distPath)) {
    console.log('✅ Package is built (dist/ exists)');
} else {
    console.log('❌ Package is not built');
    console.log('   Run: npm run build');
    hasErrors = true;
}

// Check if npm link exists
try {
    const linkPath = execSync('npm ls -g --depth=0 --link=true 2>/dev/null | grep n8n-nodes-pirate-weather || true').toString().trim();
    if (linkPath) {
        console.log('✅ npm link exists');
    } else {
        console.log('❌ npm link not found');
        console.log('   Run: npm run setup');
        hasErrors = true;
    }
} catch (e) {
    console.log('⚠️  Could not verify npm link status');
}

// Check if linked in n8n
try {
    const npmRoot = execSync('npm root -g').toString().trim();
    const linkedPath = path.join(npmRoot, 'n8n-nodes-pirate-weather');
    if (fs.existsSync(linkedPath)) {
        console.log('✅ Package is linked in n8n\'s node_modules');
    } else {
        console.log('❌ Package is not linked in n8n');
        console.log('   Run: npm run setup');
        hasErrors = true;
    }
} catch (e) {
    console.log('⚠️  Could not verify n8n link status');
}

if (!hasErrors) {
    console.log('\n🎉 Everything looks good! Run "npm run dev:n8n" to start developing.');
} else {
    console.log('\n⚠️  Some issues were found. Please fix them before running n8n.');
}