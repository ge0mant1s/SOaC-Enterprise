# SOaC Enterprise v2.0-PLATINUM Compliance Matrix

This matrix maps each SOaC package to relevant controls and clauses from NIST 800-53, ISO 27001, and GDPR.

| Package # | Package Name                      | NIST 800-53 Controls       | ISO 27001 Clauses           | GDPR Articles       | Notes/Comments                          |
|-----------|---------------------------------|----------------------------|-----------------------------|---------------------|---------------------------------------|
| 001       | Identity-led Intrusion Defense   | AC-2, IA-5, AU-6           | A.9 Access Control          | Art. 5, 25, 32      | Identity governance and access control|
| 002       | Ransomware Containment & Response| SI-4, IR-4, CP-10          | A.16 Information Security Incident Management | Art. 32, 33, 34 | Incident response and ransomware containment |
| 003       | Supply Chain & npm Compromise    | SA-12, SI-4, CM-2          | A.14 System Acquisition     | Art. 32              | Software supply chain security         |
| 004       | BYOVD & Kernel Exploit Defense   | SI-4, CM-7, SC-7           | A.12 Operations Security    | Art. 32              | Endpoint driver and kernel exploit defense |
| 005       | SEO Poisoning & Gootloader Defense| SI-4, SC-7, IR-4           | A.13 Communications Security| Art. 32              | Web and email threat detection         |
| 006       | Credential Harvesting & Phishing Kit| IA-2, AC-6, SI-4          | A.7 Human Resource Security | Art. 5, 32           | User awareness and credential protection|
| 007       | Cloud IAM Privilege Escalation   | AC-6, IA-5, SC-7           | A.9 Access Control          | Art. 5, 25, 32      | Cloud identity and access management   |
| 008       | Lateral Movement & RDP Abuse     | AC-17, SI-4, SC-7          | A.12 Operations Security    | Art. 32              | Network segmentation and lateral movement detection |
| 009       | Data Exfiltration & Staging      | MP-5, SI-4, AU-6           | A.8 Asset Management        | Art. 5, 32           | Data protection and exfiltration prevention |
| 010       | Living off the Land (LOLBins)    | SI-4, CM-7, IR-4           | A.12 Operations Security    | Art. 32              | Detection of living-off-the-land techniques |
| 011       | Insider Threat & Anomalous Behavior| AC-2, AU-6, SI-4          | A.9 Access Control          | Art. 5, 9, 32        | Insider threat detection and mitigation |

---

*Notes:*

- **NIST 800-53 Controls** are selected based on primary control families relevant to each package.
- **ISO 27001 Clauses** correspond to the main control areas addressed.
- **GDPR Articles** highlight data protection and privacy regulations impacted.
- This matrix is intended to assist compliance mapping and audit preparation.
