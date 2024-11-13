#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const os = require('os');

module.exports = function (context) {
    // Define paths
    const projectRoot = context.opts.projectRoot;
    const configTemplatePath = path.join(projectRoot, 'res/network_security_config.xml');
    const platformPath = path.join(projectRoot, 'platforms/android/app/src/main/res/xml');
    const outputConfigPath = path.join(platformPath, 'network_security_config.xml');

    // Ensure the platform directory exists
    if (!fs.existsSync(platformPath)) {
        fs.mkdirSync(platformPath, { recursive: true });
    }

    // Function to get the local IP address
    function getLocalIp() {
        const interfaces = os.networkInterfaces();
        for (let iface in interfaces) {
            for (let i = 0; i < interfaces[iface].length; i++) {
                const address = interfaces[iface][i];
                // We are looking for an IPv4 address (not loopback or internal)
                if (address.family === 'IPv4' && !address.internal) {
                    return address.address;
                }
            }
        }
        return '127.0.0.1';  // fallback to localhost if no IP found
    }

    // Get the system's local IP address
    const dynamicIp = getLocalIp();

    // Read and modify the template
    let configContent = fs.readFileSync(configTemplatePath, 'utf-8');
    configContent = configContent.replace('{DYNAMIC_IP}', dynamicIp);

    // Write the modified content to the output path
    fs.writeFileSync(outputConfigPath, configContent);

    console.log(`network_security_config.xml has been generated with for: ${dynamicIp}`);
};
