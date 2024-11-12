#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

module.exports = function (context) {
  // Define paths
  const projectRoot = context.opts.projectRoot;
  const packageJsonPath = path.join(projectRoot, 'package.json');
  const configXmlPath = path.join(projectRoot, 'config.xml');

  // Read the package.json file
  let packageJson;
  try {
    packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
  } catch (err) {
    console.error('Error reading package.json', err);
    return;
  }

  // Read the config.xml file
  let configXml;
  try {
    configXml = fs.readFileSync(configXmlPath, 'utf-8');
  } catch (err) {
    console.error('Error reading config.xml', err);
    return;
  }

  // Replace values in config.xml with values from package.json
  let updatedConfigXml = configXml
    .replace(/<widget id="([^"]+)"/, `<widget id="${packageJson.name}"`)
    .replace(/" version="([^"]+)"/, `" version="${packageJson.version}"`)
    .replace(/<name>[^<]+<\/name>/, `<name>${packageJson.displayName}</name>`)
    .replace(/<description>[^<]+<\/description>/, `<description>${packageJson.description}</description>`);

  // Handle <author> tag: update both the content and attributes
  const authorRegex = /<author([^>]*)>([^<]+)<\/author>/;
  const authorMatch = packageJson.author.match(/([^<]+)<([^>]+)>\s*\(([^)]+)\)/);

  if (authorMatch) {
    // Format the email and href from package.json author field
    const email = authorMatch[2];
    const href = authorMatch[3];
    const authorName = authorMatch[1].trim();

    // Replace author content and attributes in the config.xml
    updatedConfigXml = updatedConfigXml.replace(authorRegex,
      `<author email="${email}" href="${href}">${authorName}</author>`
    );
  }
  // Write the updated config.xml back to the file
  try {
    fs.writeFileSync(configXmlPath, updatedConfigXml, 'utf-8');
    console.log('Updated config.xml with values from package.json');
  } catch (err) {
    console.error('Error writing config.xml', err);
  }
};
