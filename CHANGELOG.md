# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Initial project setup (React, Tone.js, Spring Boot)
- GitHub Actions CI for frontend
- PR and issue templates
- Step sequencer component (WIP)

## [Unreleased] - 2025-07-26

### Added
- Step sequencer with basic playback functionality
- Synthesized drum samples: kick, snare, hi-hat, toms, clap
- Step velocity control
- Repeat count per step (e.g., 2x, 3x repeats)
- Visual playhead that follows the current step

### Changed
- Improved UI styling with new fonts (Inter, Roboto Mono)

### Fixed
- Prevented crash when triggering samples without a defined pitch (e.g., hihat, snare)
