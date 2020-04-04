# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]
### Added
* [`useForm`, `useTouch`] Adds a isDirty field that is set to true when any field is touched.

## [0.0.15] - 2020-03-22
### Fixed
* [`useForm`] Fixed an issue where `onSubmit` was being called with the current values.

## [0.0.14] - 2020-03-22
### Added
* [`useSubmission`] `onSubmit` will be called with the current Event if `submit` is called with an event.
* [`useForm`] `onSubmit` the second argument will be the event if `submit` is called with an event.

### Removed
* [`useValidation`] Removed `isValidating` from the hook.
A hook to track if a function is currently being called will be added in a later update.

## [0.0.13] - 2020-03-08
### Added
* Typescript definition files

### Changed
* [`useSettersAsRefEventHandler`] The object api now supports a `mountedValues` property that is the shape of a value object map (eg `{email: 'user@example.com'}`).  When the ref callback is mounted on an element and the `mountedValues` property is set, then the specified element's `value` property will be set to the corresponding `mountedValues` property that shares the same name as the specified element's name propert (eg `element.value = mountedValues[element.name]`).
* [`useValidation`] the returned promise for `validate` and `validateByName` no longer resolves to a map of errors.
* [`useSubmission`] Now accepts an optional `disabled` flag that is used to prevent submission if the value is `true`. This hook also no longer accepts a `validator` that resolves to a map of errors. The preferred way of preventing
submission is to set the `disabled` flag to true.  The `validator` prop is now optional.

## [0.0.11] - 2019-12-22
### Added
* [`useValidateAsSetter`] Added a hook that supports using `validate` from `useFrom` with
    `useSettersAsRefEventHandler`, and `useSettersAsEventHandler`

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