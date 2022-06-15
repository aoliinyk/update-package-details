#!/usr/bin/env node

const logger = console;
const yargs = require('yargs/yargs')
const { hideBin } = require('yargs/helpers');
const { updateBitbucketRepo } = require('./update-bitbucket-repo');
const argv = yargs(hideBin(process.argv)).argv

// TODO: implement help
const {
  packageName,
  packageVersion,
  repositoryName,
  username,
  password
} = argv;

// TODO properly validate repo details
if (!repositoryName || !username || !password) {
  logger.error('Bitbucket details parameters are missing: repositoryName, username and password should be present');
  process.exit(1)
}
// TODO: properly validate package name and version semantics
if (!packageName || !packageVersion) {
  logger.error('Package parameters are missing: package-name and package-version should be present');
  process.exit(1)
}

logger.info(`Will update package with name "${packageName}" to version "${packageVersion}" for repository "${repositoryName}"`);

updateBitbucketRepo({ username, password, repositoryName, packageName, packageVersion })
  .catch(logger.error);
