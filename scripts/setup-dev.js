#!/usr/bin/env node
const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');
const os = require('os');

console.log('🚀 Setting up n8n-nodes-pirate-weather for local development...\n');

// Build the project first
console.log('📦 Building the project...');
execSync('npm run build', { stdio: 'inherit' });

// Create npm link
console.log('\n🔗 Creating npm link...');
execSync('npm link', { stdio: 'inherit' });

// Find n8n's global installation
console.log('\n🔍 Finding n8n installation...');
const npmRoot = execSync('npm root -g').toString().trim();
const n8nPath = path.join(npmRoot, 'n8n');

if (!fs.existsSync(n8nPath)) {
    console.error('❌ n8n not found globally. Please install it first:');
    console.error('   npm install -g n8n');
    process.exit(1);
}

// Link the package in n8n's node_modules
console.log('\n🔗 Linking package to n8n...');
process.chdir(npmRoot);
execSync('npm link n8n-nodes-pirate-weather', { stdio: 'inherit' });

// Create .n8n directory if it doesn't exist
const n8nUserFolder = path.join(os.homedir(), '.n8n');
if (!fs.existsSync(n8nUserFolder)) {
    console.log('\n📁 Creating .n8n directory...');
    fs.mkdirSync(n8nUserFolder, { recursive: true });
}

console.log('\n✅ Setup complete!');
console.log('\n📋 Next steps:');
console.log('1. Run "npm run dev:n8n" to start development');
console.log('2. Open http://localhost:5678 in your browser');
console.log('3. Your Pirate Weather node will be available in the nodes panel');
console.log('4. Create credentials: Settings → Credentials → New → Pirate Weather API');
console.log('\n💡 Tip: Changes to your code will auto-compile, but you need to restart n8n to see them.');