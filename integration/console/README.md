# SOaC Analyst Console (MVP)
## Visualizing Autonomous Security Operations

The Analyst Console is the "Window into the Brain." It provides a high-impact, web-based interface for security analysts to monitor, validate, and approve autonomous decisions made by the SOaC-Enterprise framework.

### 📂 Repository Path
`integration/console/`

### Key Features
- **Real-Time Alert Stream:** Visualizes telemetry from the "Body."
- **Explainable AI:** Displays the "Brain's" reasoning and confidence score for every verdict.
- **Human-in-the-Loop (HITL):** Allows analysts to approve or dismiss automated "Purpose" (Playbook) executions with a single click.
- **Futuristic UI:** Built with Tailwind CSS for a sleek, "Cyber-Ops" aesthetic.

### How to Run
1. Install Flask:
   ```bash
   pip install flask
   ```
2. Navigate to the console directory:
   ```bash
   cd integration/console
   ```
3. Start the server:
   ```bash
   python app.py
   ```
4. Open your browser at `http://127.0.0.1:5000`.

### Differentiator vs. Big Vendors
Most "Autonomous SOC" vendors are black boxes. SOaC-Enterprise gives you a **Glass Box**. You see the telemetry, you see the AI's logic, and you maintain ultimate control over the response.
