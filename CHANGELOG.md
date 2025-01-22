# [2.0.0](https://github.com/akadenia/AkadeniaAzureStorage/compare/1.8.0...2.0.0) (2025-01-22)


### Bug Fixes

* **blob:** update generateSASUrl method to take expiresOn as a Date ([#33](https://github.com/akadenia/AkadeniaAzureStorage/issues/33)) ([394ec74](https://github.com/akadenia/AkadeniaAzureStorage/commit/394ec74f3859b3d12b31ce25c8d781531e63bf2f))


### BREAKING CHANGES

* **blob:** Sas option `expires: number` was replaced by `expiresOn: Date`

<!-- This is an auto-generated comment: release notes by coderabbit.ai
-->

## Summary by CodeRabbit

- **New Features**
- Updated SAS (Shared Access Signature) token generation to use explicit
date-based expiration
- Improved handling of token expiration times with more precise `Date`
object support

- **Bug Fixes**
- Refined SAS URL generation to provide clearer expiration time
management

<!-- end of auto-generated comment: release notes by coderabbit.ai -->

# [1.8.0](https://github.com/akadenia/AkadeniaAzureStorage/compare/1.7.0...1.8.0) (2024-12-20)


### Features

* **deps:** upgrade npm dependencies ([d3bbaa7](https://github.com/akadenia/AkadeniaAzureStorage/commit/d3bbaa7aaab3b95161cb82193dedb7a96983eff0))

# [1.7.0](https://github.com/akadenia/AkadeniaAzureStorage/compare/1.6.1...1.7.0) (2024-10-08)


### Features

* **blob:** add blob http headers for upload data and upload function ([#30](https://github.com/akadenia/AkadeniaAzureStorage/issues/30)) ([f4fec59](https://github.com/akadenia/AkadeniaAzureStorage/commit/f4fec59a087e566f58ece6c1e41a9c25e219907a))

## [1.6.1](https://github.com/akadenia/AkadeniaAzureStorage/compare/1.6.0...1.6.1) (2024-10-07)


### Bug Fixes

* **sas:** fix not detecting the container name from the sas url ([#28](https://github.com/akadenia/AkadeniaAzureStorage/issues/28)) ([3391880](https://github.com/akadenia/AkadeniaAzureStorage/commit/3391880e02b181576cc992aad07b8d39fcef0034))

# [1.6.0](https://github.com/akadenia/AkadeniaAzureStorage/compare/1.5.1...1.6.0) (2024-10-07)


### Features

* **blob,sas-url:** add create and delete container, fix blob sas url, add tests ([#26](https://github.com/akadenia/AkadeniaAzureStorage/issues/26)) ([1c47116](https://github.com/akadenia/AkadeniaAzureStorage/commit/1c47116ddc2b1e22bda48bdf8786041ce25961c9))

## [1.5.1](https://github.com/akadenia/AkadeniaAzureStorage/compare/1.5.0...1.5.1) (2024-10-03)


### Bug Fixes

* **test,npm:** update homepage and fix table tests ([40f82eb](https://github.com/akadenia/AkadeniaAzureStorage/commit/40f82eb5135cc94b913a5cdbab98f4572c90b18d))

# [1.5.0](https://github.com/akadenia/AkadeniaAzureStorage/compare/1.4.1...1.5.0) (2024-09-23)


### Features

* **queue:** add delete and receive queue messages ([a4bb0fb](https://github.com/akadenia/AkadeniaAzureStorage/commit/a4bb0fb70a809e050a9d912d063950b4086cd44b))

## [1.4.1](https://github.com/akadenia/AkadeniaAzureStorage/compare/1.4.0...1.4.1) (2024-09-23)


### Bug Fixes

* **readme:** untrack the readme.hbs file ([#22](https://github.com/akadenia/AkadeniaAzureStorage/issues/22)) ([831ce9a](https://github.com/akadenia/AkadeniaAzureStorage/commit/831ce9a0afa2effd833f559f8c93714f117c2e72))

# [1.4.0](https://github.com/akadenia/AkadeniaAzureStorage/compare/1.3.1...1.4.0) (2024-09-20)


### Features

* **blob-storage:** add support for sas url ([#20](https://github.com/akadenia/AkadeniaAzureStorage/issues/20)) ([4c5b0bd](https://github.com/akadenia/AkadeniaAzureStorage/commit/4c5b0bde8277e594f027850e16eeec9f66f05735))

# [1.3.0](https://github.com/akadenia/AkadeniaAzureStorage/compare/1.2.4...1.3.0) (2024-08-29)


### Bug Fixes

* **dependabot:** bump fast-xml-parser from 4.4.0 to 4.4.1 ([#13](https://github.com/akadenia/AkadeniaAzureStorage/issues/13)) ([7d44e50](https://github.com/akadenia/AkadeniaAzureStorage/commit/7d44e50276fed195c76a8f3da177ee4410580535)), closes [#1](https://github.com/akadenia/AkadeniaAzureStorage/issues/1) [#4](https://github.com/akadenia/AkadeniaAzureStorage/issues/4) [#7](https://github.com/akadenia/AkadeniaAzureStorage/issues/7) [#8](https://github.com/akadenia/AkadeniaAzureStorage/issues/8)


### Features

* **docs:** add generate docs script ([#15](https://github.com/akadenia/AkadeniaAzureStorage/issues/15)) ([ee2be5e](https://github.com/akadenia/AkadeniaAzureStorage/commit/ee2be5eab5d5b4a6bdc99e8769c60cbf2537e4f4)), closes [#13](https://github.com/akadenia/AkadeniaAzureStorage/issues/13) [#1](https://github.com/akadenia/AkadeniaAzureStorage/issues/1) [#4](https://github.com/akadenia/AkadeniaAzureStorage/issues/4) [#7](https://github.com/akadenia/AkadeniaAzureStorage/issues/7) [#8](https://github.com/akadenia/AkadeniaAzureStorage/issues/8)
* semantic release setup ([#7](https://github.com/akadenia/AkadeniaAzureStorage/issues/7)) ([1d1d10e](https://github.com/akadenia/AkadeniaAzureStorage/commit/1d1d10eb5308477b7daec46b4319cbeecbcdbefa))
* **table-storage:** implement azure table support  ([#14](https://github.com/akadenia/AkadeniaAzureStorage/issues/14)) ([4fc44f9](https://github.com/akadenia/AkadeniaAzureStorage/commit/4fc44f9b2c9603d82abe41be9213c94636f8e959))

## [1.2.4](https://github.com/akadenia/AkadeniaAzureStorage/compare/v1.2.3...1.2.4) (2024-06-07)


### Bug Fixes

* **ci:** correct prepare step for npm publish ([d04e613](https://github.com/akadenia/AkadeniaAzureStorage/commit/d04e613871dc034d2d5d929549f194c2f02ccdd6))
* release config update to npm plugin ([4e83b78](https://github.com/akadenia/AkadeniaAzureStorage/commit/4e83b78e60464b46cb812d56a62678c0ee700a21))
