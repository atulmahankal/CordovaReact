#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

module.exports = function(context) {
    // Define paths
    const projectRoot = context.opts.projectRoot;
    const packageJsonPath = path.join(projectRoot, 'package.json');
    const manifestJsonPath = path.join(projectRoot, 'www', 'manifest.json');

    // Read the package.json file
    let packageJson;
    try {
        packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
    } catch (err) {
        console.error('Error reading package.json:', err);
        return;
    }

    // Read the manifest.json file
    let manifestJson;
    try {
        manifestJson = JSON.parse(fs.readFileSync(manifestJsonPath, 'utf-8'));
    } catch (err) {
        console.error('Error reading manifest.json:', err);
        return;
    }

    // Update  manifest.json  from package.json
    manifestJson.short_name = packageJson.name.split('.').pop() ?? "";
    manifestJson.name = packageJson.displayName ?? "";
    manifestJson.version = packageJson.version ?? "";
    manifestJson.description = packageJson.description ?? "";

    // Write the updated manifest.json back to the file
    try {
        fs.writeFileSync(manifestJsonPath, JSON.stringify(manifestJson, null, 2), 'utf-8');
        console.log('Updated manifest.json from package.json');
    } catch (err) {
        console.error('Error writing manifest.json:', err);
    }
};
