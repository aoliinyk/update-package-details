const BitbucketUtil = require('./bitbucket-util');
const logger = console;

async function updateBitbucketRepo({ username, password, repositoryName, packageName, packageVersion }) {
  const bitbucketUtil = new BitbucketUtil({ username, password, repositoryName });

  // get package.json from latest master and check if package exists
  const parsedPackageData = await bitbucketUtil.getPackageFileData();
  if (!parsedPackageData?.dependencies?.[packageName]) {
    // TODO: Maybe search in dev dependencies?.. (depends on requirements)
    throw new Error(`Package "${packageName}" does not exist in dependencies. Nothing to upgrade`)
  }
  logger.debug(`Found package "${packageName} with version "${parsedPackageData.dependencies[packageName]}". Will upgrade to version "${packageVersion}"`)

  // create new branch for changes
  const upgradeBranchName = `upgrade-${packageName}-${Date.now()}`;
  const branchData = await bitbucketUtil.createBranch(upgradeBranchName);
  logger.debug(`Created branch with name ${branchData.name}`);

  // create new commit with updated package.json
  parsedPackageData.dependencies[packageName] = packageVersion;
  const updatedPackageData = JSON.stringify(parsedPackageData, null, 2);
  await bitbucketUtil.createCommitFromPackageFile(
    upgradeBranchName,
    updatedPackageData,
    `upgrade "${packageName}" to version "${packageVersion}"`,
  )

  // open new PR to source branch
  const prData = await bitbucketUtil.createPullRequest(
    upgradeBranchName,
    `Upgrade "${packageName}" to version "${packageVersion}"`,
  );
  logger.debug(`Created a new PR with title ${prData.title}`);
}

module.exports = { updateBitbucketRepo };
