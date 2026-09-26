# ARC — AI Responsive Companion

> **"Speak. Connect. Stay Safe."**  
> *"Technology that adapts to the elder — not the other way around."*

Welcome to the **ARC** hackathon prototype workspace.

The complete solution is organized in the [`arc/`](./arc) directory.

### Quick Start:

1. **Backend (FastAPI & LangGraph):**
   ```powershell
   $env:PYTHONPATH='arc/backend'; .\arc_venv\Scripts\uvicorn app.main:app --reload --port 8000
   ```
   *Swagger Docs: [http://localhost:8000/docs](http://localhost:8000/docs)*

2. **Caregiver Web Portal (Vite React):**
   ```bash
   cd arc/apps/caregiver-web
   npm run dev
   ```
   *Portal: [http://localhost:3000](http://localhost:3000)*

3. **Elder Mobile App (React Native Expo):**
   ```bash
   cd arc/apps/mobile
   npm run web
   ```
   *App: [http://localhost:8081](http://localhost:8081)*

4. **Run Automated Test Suite:**
   ```powershell
   $env:PYTHONPATH='arc/backend'; .\arc_venv\Scripts\python.exe -m pytest arc/backend/tests -v
   ```

For detailed architecture diagrams, database models, voice pipeline blueprints, and demo scripts, please review:
- **[Full Documentation & Architecture](./arc/README.md)**
- **[System Architecture Guide](./arc/docs/architecture.md)**
- **[API Specification](./arc/docs/api.md)**
- **[Hackathon Demo Script](./arc/docs/demo.md)**
