# Music Workstation

A web-based digital audio workstation (DAW) built with React, Tone.js, and Spring Boot. Create music right in your browser.

---

## Tech Stack

- **React** (Vite) – web UI
- **Tone.js** – Web Audio API abstraction
- **Spring Boot** – backend server
- **GitHub Actions** – CI/CD workflow

---

## Features (WIP)

- [x] Step sequencer (in progress)
- [ ] Track layering
- [ ] Playback and export

---

## 🛠 Setup Instructions

### Frontend

```bash
cd web
npm install
npm run dev
```

### Backend

```bash
cd server
./mvnw spring-boot:run
```

## Deployment

Deployed via rsync to a VPS (Hostinger) under:
musicworkstation.lagama.site

CI/CD is handled with GitHub Actions upon merge to main.

## Project Structure

```
music-workstation/
├── web/        # React + Tone.js app
├── server/     # Spring Boot API
├── .github/    # CI/CD and templates
```

## 🤝 Contributing

See CONTRIBUTING.md for commit guidelines and branching rules.

## License

MIT
This project uses fonts licensed under the SIL Open Font License. See NOTICE.md for font details.
