const { Bitbucket } = require('bitbucket');

class BitbucketUtil {
  constructor({ username, password, repositoryName }) {
    this.sourceBranch = 'master';
    this.packageFileName = 'package.json';
    this.workspace = username;
    this.repo = repositoryName;
    this.bitbucket = new Bitbucket({
      auth: {
        username,
        password,
      },
    });
  }

  async getPackageFileData() {
    const { data: sourceBranchData } = await this.bitbucket.refs.getBranch({
      repo_slug: this.repo,
      workspace: this.workspace,
      name: this.sourceBranch,
    });
    const { data: packageData } = await this.bitbucket.source.read({
      repo_slug: this.repo,
      workspace: this.workspace,
      commit: sourceBranchData.target.hash,
      path: this.packageFileName,
    });

    return JSON.parse(packageData);
  }

  async createBranch(branchName) {
    const { data: branchData } = await this.bitbucket.refs.createBranch({
      repo_slug: this.repo,
      workspace: this.workspace,
      _body: {
        name : branchName,
        target : {
          hash : this.sourceBranch ,
        }
      }
    });
    return branchData;
  }

  async createCommitFromPackageFile(branchName, packageData, message) {
    return this.bitbucket.source.createFileCommit({
      repo_slug: this.repo,
      workspace: this.workspace,
      _body: {
        message,
        branch: branchName,
        [this.packageFileName]: packageData,
      },
    });
  }

  async createPullRequest(branchName, title) {
    const { data: prData } = await this.bitbucket.pullrequests.create({
      repo_slug: this.repo,
      workspace: this.workspace,
      _body: {
        title,
        source: {
          branch: {
            name: branchName,
          }
        },
        destination: {
          branch: {
            name: this.sourceBranch,
          },
        },
      },
    });
    return prData;
  }
}

module.exports = BitbucketUtil;
