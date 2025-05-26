const path = require('path');
const { task, src, dest, watch, series } = require('gulp');
const { exec } = require('child_process');
const fs = require('fs');
const os = require('os');

task('build:icons', copyIcons);

function copyIcons() {
	const nodeSource = path.resolve('nodes', '**', '*.{png,svg}');
	const nodeDestination = path.resolve('dist', 'nodes');

	src(nodeSource).pipe(dest(nodeDestination));

	const credSource = path.resolve('credentials', '**', '*.{png,svg}');
	const credDestination = path.resolve('dist', 'credentials');

	return src(credSource).pipe(dest(credDestination));
}

// Build TypeScript files
function buildTypeScript(cb) {
	console.log('Building TypeScript files...');
	exec('npm run build', (err, stdout, stderr) => {
		if (err) {
			console.error('Build failed:', stderr);
			cb(err);
		} else {
			console.log('Build completed successfully');
			cb();
		}
	});
}

// Copy built files to ~/.n8n/custom
function copyToN8nCustom(cb) {
	const customDir = path.join(os.homedir(), '.n8n', 'custom');
	const distDir = path.resolve('dist');
	
	// Create custom directory if it doesn't exist
	if (!fs.existsSync(customDir)) {
		fs.mkdirSync(customDir, { recursive: true });
		console.log(`Created directory: ${customDir}`);
	}
	
	// Copy package.json
	const packageSource = path.resolve('package.json');
	const packageDest = path.join(customDir, 'package.json');
	fs.copyFileSync(packageSource, packageDest);
	console.log(`Copied: package.json → ${packageDest}`);
	
	// Copy all files from dist directory
	exec(`cp -r ${distDir}/* ${customDir}/`, (err) => {
		if (err) {
			console.error('Copy failed:', err);
			cb(err);
		} else {
			console.log(`Copied built files to: ${customDir}`);
			console.log('Files copied successfully! Restart n8n to load the changes.');
			cb();
		}
	});
}

// Watch and copy task
task('watch-and-copy', function() {
	console.log('Starting watch-and-copy task...');
	console.log('Watching for TypeScript file changes...');
	
	// Initial build and copy
	series(buildTypeScript, copyToN8nCustom)();
	
	// Watch TypeScript files
	const tsFiles = [
		'nodes/**/*.ts',
		'credentials/**/*.ts',
		'!node_modules/**'
	];
	
	watch(tsFiles, series(buildTypeScript, copyToN8nCustom));
	
	// Watch icon files
	const iconFiles = [
		'nodes/**/*.{png,svg}',
		'credentials/**/*.{png,svg}'
	];
	
	watch(iconFiles, series('build:icons', copyToN8nCustom));
});
