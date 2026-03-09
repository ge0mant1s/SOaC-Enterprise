# SOaC-Enterprise Compliance Matrix

This matrix maps each SOaC package to relevant controls and clauses from NIST 800-53, ISO 27001, and GDPR.

| Package # | Package Name                      | NIST 800-53 Controls          | ISO 27001 Clauses             | GDPR Articles                 | Notes/Comments                          |
|-----------|---------------------------------|-------------------------------|------------------------------|------------------------------|---------------------------------------|
| 001       | Identity Control Plane Defense   | AC-2, IA-5, AU-6              | A.9 Access Control           | Art. 5, 25, 32               | Identity governance and access control|
| 002       | Cloud Control Plane Defense      | SC-7, AC-6, SI-4              | A.13 Communications Security | Art. 32, 33                  | Cloud API security and monitoring     |
| 003       | SaaS Pivot & Data Extortion      | AC-6, SI-4, MP-5              | A.10 Cryptography            | Art. 5, 32                   | SaaS data protection and exfiltration |
| 004       | Social Engineering & RMM Abuse   | AT-2, SI-4, IR-4              | A.7 Human Resource Security  | Art. 32                      | User awareness and endpoint security  |
| 005       | Perimeter Exploit Chaining       | SC-7, SI-4, CA-7              | A.12 Operations Security     | Art. 32                      | Network perimeter defense             |
| 006       | GenAI & LLM Abuse Defense        | SI-4, PL-2, RA-5              | A.18 Compliance              | Art. 5, 25                   | AI governance and data privacy        |
| 007       | Critical Infrastructure Resilience| CP-2, SC-7, IR-4              | A.14 System Acquisition      | Art. 32                      | OT/ICS security and resilience        |
| 008       | Sandworm Destructive Defense     | IR-4, SI-4, CP-10             | A.16 Information Security Incident Management | Art. 33, 34          | Incident response and malware defense |
| 009       | Financial Industry Defense       | AC-2, AU-6, SI-4              | A.8 Asset Management         | Art. 5, 32                   | Financial transaction security        |
| 010       | Lazarus Group Defense            | SI-4, IR-4, SC-7              | A.12 Operations Security     | Art. 32                      | Advanced persistent threat defense    |
| 011       | Healthcare Resilience            | AC-2, AU-6, SI-4              | A.9 Access Control           | Art. 5, 9, 32                | PHI protection and healthcare security|
