# Update Package Details Script

## Description 

This script updates specific package with provided version in the package.json in BitBucket repo and opens a pull request for provided changes

## App Password

Current script is using Username and AppPassword for Basic Authorization on Bitbucket

[Generate App Password DOCS](https://bitbucket.org/account/settings/app-passwords/)

## Usage

User should provide repository details and package details to run script

After clonning of repo please run `npm install` first

### Parameters

- `package-name` - string without spaces, package to update
- `package-version` - version in semantic format (e.g. 1.1.1)
- `repository-name` - name of repository. Repository should contain `package.json` file in root directory
- `username` - user name
- `password` - **App Password** for provided user

### Running script

Usage examples

```bash
node index.js --package-name=some-test-dep --package-version=1.1.1 --repository-name=test-bitbucket-repo --username=some_user --password=app_password
# or
npmst -- --package-name=some-test-dep --package-version=1.1.1 --repository-name=test-bitbucket-repo --username=some_user --password=app_password
```

Script will check if package is present in dependencies of `package.json` file and will upgrade it's version and will create a PR.
