# Package ZIP release assets (pkg-001..pkg-011)

`downloads/package-sources/` contains the tracked plaintext source files for the package ZIP bundles.

Build deterministic release ZIPs:

```bash
python3 tools/package-zips/build_release_zips.py --output-dir /tmp/pkg-zips
```

The release workflow uses this same script and uploads `pkg-001.zip`..`pkg-011.zip` as release assets.
