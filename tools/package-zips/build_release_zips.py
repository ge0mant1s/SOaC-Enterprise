#!/usr/bin/env python3
"""Build deterministic pkg-001..pkg-011 ZIP release assets from tracked sources.

Usage:
  python3 tools/package-zips/build_release_zips.py --output-dir <dir>
"""
from __future__ import annotations

import argparse
import hashlib
import json
import os
from pathlib import Path
import stat
import zipfile

EPOCH_DT = (1980, 1, 1, 0, 0, 0)  # earliest DOS datetime zip supports

REPO_ROOT = Path(__file__).resolve().parents[2]
SOURCE_ROOT = REPO_ROOT / "downloads" / "package-sources"

PACKAGES = {
    "pkg-001": [
        ("pkg-001/README.md", "pkg-001/README.md"),
        ("pkg-001/ai_governance_baseline.yaml", "pkg-001/ai_governance_baseline.yaml"),
        ("pkg-001/revoke_sessions.yaml", "pkg-001/revoke_sessions.yaml"),
        ("pkg-001/splunk_sample_detection.spl", "pkg-001/splunk_sample_detection.spl"),
    ],
    "pkg-002": [
        ("pkg-002/README.md", "pkg-002/README.md"),
        ("pkg-002/edge_api_spec_v1.md", "pkg-002/edge_api_spec_v1.md"),
        ("pkg-002/isolate_host.yaml", "pkg-002/isolate_host.yaml"),
    ],
    "pkg-003": [
        ("pkg-003/README.md", "pkg-003/README.md"),
        ("pkg-003/lab_safety_policy.yaml", "pkg-003/lab_safety_policy.yaml"),
    ],
    "pkg-004": [
        ("pkg-004/README.md", "pkg-004/README.md"),
    ],
    "pkg-005": [
        ("pkg-005/README.md", "pkg-005/README.md"),
    ],
    "pkg-006": [
        ("pkg-006/detection.yaml", "detection.yaml"),
        ("pkg-006/metadata.yml", "metadata.yml"),
        ("pkg-006/playbook.yaml", "playbook.yaml"),
        ("pkg-006/policy.yaml", "policy.yaml"),
    ],
    "pkg-007": [
        ("pkg-007/detection.yaml", "detection.yaml"),
        ("pkg-007/metadata.yml", "metadata.yml"),
        ("pkg-007/playbook.yaml", "playbook.yaml"),
        ("pkg-007/policy.yaml", "policy.yaml"),
    ],
    "pkg-008": [
        ("pkg-008/detection.yaml", "detection.yaml"),
        ("pkg-008/metadata.yml", "metadata.yml"),
        ("pkg-008/playbook.yaml", "playbook.yaml"),
        ("pkg-008/policy.yaml", "policy.yaml"),
    ],
    "pkg-009": [
        ("pkg-009/detection.yaml", "detection.yaml"),
        ("pkg-009/metadata.yml", "metadata.yml"),
        ("pkg-009/playbook.yaml", "playbook.yaml"),
        ("pkg-009/policy.yaml", "policy.yaml"),
    ],
    "pkg-010": [
        ("pkg-010/detection.yaml", "detection.yaml"),
        ("pkg-010/metadata.yml", "metadata.yml"),
        ("pkg-010/playbook.yaml", "playbook.yaml"),
        ("pkg-010/policy.yaml", "policy.yaml"),
    ],
    "pkg-011": [
        ("pkg-011/detection.yaml", "detection.yaml"),
        ("pkg-011/metadata.yml", "metadata.yml"),
        ("pkg-011/playbook.yaml", "playbook.yaml"),
        ("pkg-011/policy.yaml", "policy.yaml"),
    ],
}


def _zip_dir_entry(zf: zipfile.ZipFile, entry: str) -> None:
    zi = zipfile.ZipInfo(entry)
    zi.date_time = EPOCH_DT
    zi.compress_type = zipfile.ZIP_STORED
    zi.external_attr = (stat.S_IFDIR | 0o755) << 16
    zf.writestr(zi, b"")


def _zip_file_entry(zf: zipfile.ZipFile, entry: str, content: bytes) -> None:
    zi = zipfile.ZipInfo(entry)
    zi.date_time = EPOCH_DT
    zi.compress_type = zipfile.ZIP_DEFLATED
    zi.external_attr = (stat.S_IFREG | 0o644) << 16
    zf.writestr(zi, content)


def build_one(pkg_id: str, mappings: list[tuple[str, str]], out_path: Path) -> dict:
    with zipfile.ZipFile(out_path, "w") as zf:
        if pkg_id in {"pkg-001", "pkg-002", "pkg-003", "pkg-004", "pkg-005"}:
            _zip_dir_entry(zf, f"{pkg_id}/")
        for src_rel, arcname in sorted(mappings, key=lambda x: x[1]):
            src = SOURCE_ROOT / src_rel
            if not src.exists():
                raise FileNotFoundError(f"Missing source file for {pkg_id}: {src}")
            _zip_file_entry(zf, arcname, src.read_bytes())

    digest = hashlib.sha256(out_path.read_bytes()).hexdigest()
    with zipfile.ZipFile(out_path) as zf:
        names = sorted(zf.namelist())
    return {"zip": out_path.name, "sha256": digest, "entries": names}


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--output-dir", required=True)
    args = ap.parse_args()

    out_dir = Path(args.output_dir)
    out_dir.mkdir(parents=True, exist_ok=True)

    summary = []
    for pkg_id in sorted(PACKAGES):
        out_path = out_dir / f"{pkg_id}.zip"
        summary.append(build_one(pkg_id, PACKAGES[pkg_id], out_path))

    (out_dir / "package-zips-manifest.json").write_text(json.dumps(summary, indent=2) + "\n")
    print(json.dumps(summary, indent=2))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
