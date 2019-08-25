# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]
### Removed
* [`useValidation`] Removed the use expectedFields parameter as it was never used

### Fixed
* [`useValidation`] prevents `validate` from calling validators twice when `useValidation` is called with a validation map.

## [0.0.6] - 2019-08-18
### Changed
* [`useConstraint`] Updated the url regex pattern
* [`useConstraint`] Updated all constraints to accept `0` as a non-empty value

### Fixed
* [`useConstraint`] Fixed an issue with setting custom error messages for required constraints