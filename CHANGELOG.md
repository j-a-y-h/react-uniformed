# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.0.10] - 2019-12-14
### Added
* [`useForm`] adds `useConstraints` support via the optional `constraints` parameter

### Changed
* [`useForm`] Renamed `defaultValues` parameter to `initialValues`
* [`useSettersAsRefEventHandler`] `event` is optional when using the hook with options.
* [`useSettersAsRefEventHandler`] `handlers` must be called with an array of function when using the hook with options.

## [0.0.9] - 2019-09-08
### Added
* [`useNormalizers`] added a hook (`useNormalizers`) for normalizing input values
* [`normalizeNestedObjects`] added a `useNormalizer` compatible function that handles nested objects and arrays

### Changed
* [`useSettersAsEventHandler`] Changed the third argument that is invoked with each handler from an Event to an EventTarget

## [0.0.8] - 2019-09-1
### Fixed
* [`useForm`, `useFields`] Resetting fields now sets the value to empty string if no default value

### Changed
* [`useConstraint`] Update the number regex pattern

### Added
* [`useError`, `useFields`, `useTouch`] Added the ability to set values using a function callback

## [0.0.7] - 2019-08-24
### Removed
* [`useValidation`] Removed the unused `expectedFields` parameter

### Fixed
* [`useValidation`] Prevents `validate` from calling validators twice when `useValidation` is called with a validation map.

## [0.0.6] - 2019-08-18
### Changed
* [`useConstraint`] Updated the url regex pattern
* [`useConstraint`] Updated all constraints to accept `0` as a non-empty value

### Fixed
* [`useConstraint`] Fixed an issue with setting custom error messages for required constraints