import hashlib
import json
import zipfile
from pathlib import Path

fixtures_dir = Path("tests/fixtures")
fixtures_dir.mkdir(parents=True, exist_ok=True)

manifest = {
    "format": "portad",
    "version": "0.1",
    "created_at": "2026-11-12T00:00:00Z",
    "producer": {
        "tool": "portad",
        "version": "0.1.0",
    },
    "source": {
        "provider": "fixtures",
        "adapter": "fixtures@0.1.0",
    },
    "target": None,
    "objects": {
        "pages": 1,
    },
}

workspace = {
    "id": "workspace_01J00000000000000000000000",
    "name": "Pilot Fixture Workspace",
    "created_at": "2026-11-12T00:00:00Z",
}

manifest_bytes = json.dumps(manifest, indent=2).encode("utf-8")
workspace_bytes = json.dumps(workspace, indent=2).encode("utf-8")

checksums = {
    "algorithm": "sha256",
    "entries": [
        {
            "path": "manifest.json",
            "sha256": hashlib.sha256(manifest_bytes).hexdigest(),
            "bytes": len(manifest_bytes),
        },
        {
            "path": "workspace.json",
            "sha256": hashlib.sha256(workspace_bytes).hexdigest(),
            "bytes": len(workspace_bytes),
        },
    ],
}
checksums_bytes = json.dumps(checksums, indent=2).encode("utf-8")

fixture_path = fixtures_dir / "minimal.portad"
with zipfile.ZipFile(fixture_path, "w", compression=zipfile.ZIP_DEFLATED) as zf:
    zf.writestr("manifest.json", manifest_bytes)
    zf.writestr("workspace.json", workspace_bytes)
    zf.writestr("checksums.json", checksums_bytes)

print(f"Created {fixture_path} ({fixture_path.stat().st_size} bytes)")
