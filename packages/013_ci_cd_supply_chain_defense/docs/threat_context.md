# Threat Context: CI/CD Supply Chain Attacks

## Background

CI/CD pipelines are high-value targets. Compromising build infrastructure provides access to secrets, signing keys, and the ability to inject malicious code into every downstream artifact.

## Attack Vector

1. **Tag Mutation** — Attacker force-pushes a malicious commit to an existing release tag
2. **Build Hijack** — Downstream pipelines pulling the tag execute attacker-controlled code
3. **Secret Harvest** — Build runner secrets (SSH keys, deploy tokens) are exfiltrated
4. **Artifact Tampering** — Compromised build produces backdoored container images

## Real-World Precedents

- **SolarWinds (2020)** — Build system compromise, malicious update distribution
- **Codecov (2021)** — CI/CD credential exfiltration via compromised bash uploader
- **GitHub Actions (2023)** — Supply chain attack via compromised action dependencies
