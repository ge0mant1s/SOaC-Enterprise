# SOaC Playbook Low-Code Editor
## Democratizing Security-as-Code

The Playbook Editor is a low-code interface designed to help security engineers build the "Purpose" (Response Logic) of the SOaC framework without manually writing YAML.

### 📂 Repository Path
`integration/editor/`

### Why a Low-Code Editor?
- **Speed:** Reduce the time to deploy a new response from hours to minutes.
- **Standardization:** Ensure all playbooks follow the SOaC schema.
- **Accessibility:** Allow non-developers to contribute to the security-as-code repository.

### How to Run
1. Install dependencies:
   ```bash
   pip install flask pyyaml
   ```
2. Start the editor:
   ```bash
   python integration/editor/app.py
   ```
3. Access at `http://127.0.0.1:5001`.

### Differentiator
While other SOAR platforms are complex and heavy, the SOaC Editor is lightweight, portable, and outputs clean, version-controllable YAML that fits perfectly into a GitOps workflow.
