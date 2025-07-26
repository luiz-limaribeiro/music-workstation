# Contributing to Music Workstation

This document outlines the conventions and contribution flow.

## Tech Stack

- Frontend: React (Vite)
- Audio: Tone.js
- Backend: Spring Boot

## 💬 Git Commit Conventions

Follow [Conventional Commits](https://www.conventionalcommits.org/) with these types:

- `feat:` – New feature
- `fix:` – Bug fix
- `docs:` – Docs or templates
- `ci:` – GitHub Actions
- `chore:` – Non-code updates
- `refactor:` – Code restructuring

Example:
```bash
feat: implement basic step sequencer grid
```

## Branching

- Use feature branches: `feature/<feature-name>`
- Use draft PRs from work in progress
- Merge to `main` only when the feature is complete

## Setup Instructions

```bash
cd web
npm install
npm run dev
```
```bash
cd server
./mvnw spring-boot:run
```

## Reporting Issues
Please use the Issue Templates provided when creating bugs or feature requests.
