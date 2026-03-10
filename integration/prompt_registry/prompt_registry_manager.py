import os
import json
from typing import Optional, List

class PromptRegistryManager:
    def __init__(self, base_path: str = "integration/prompt_registry/prompts"):
        self.base_path = base_path
        if not os.path.exists(self.base_path):
            os.makedirs(self.base_path)

    def list_versions(self, package_id: str) -> List[str]:
        pkg_path = os.path.join(self.base_path, package_id)
        if not os.path.exists(pkg_path):
            return []
        return sorted([f for f in os.listdir(pkg_path) if f.endswith('.txt')])

    def get_latest_version(self, package_id: str) -> Optional[str]:
        versions = self.list_versions(package_id)
        if not versions:
            return None
        return versions[-1]

    def get_prompt(self, package_id: str, version: Optional[str] = None) -> Optional[str]:
        pkg_path = os.path.join(self.base_path, package_id)
        if not version:
            version = self.get_latest_version(package_id)
        if not version:
            return None
        prompt_path = os.path.join(pkg_path, version)
        if not os.path.exists(prompt_path):
            return None
        with open(prompt_path, 'r') as f:
            return f.read()

    def add_prompt_version(self, package_id: str, prompt_text: str) -> str:
        pkg_path = os.path.join(self.base_path, package_id)
        if not os.path.exists(pkg_path):
            os.makedirs(pkg_path)
        versions = self.list_versions(package_id)
        if versions:
            last_version = versions[-1]
            last_num = int(last_version.replace('v', '').replace('.txt', ''))
            new_version_num = last_num + 1
        else:
            new_version_num = 1
        new_version = f"v{new_version_num}.txt"
        prompt_path = os.path.join(pkg_path, new_version)
        with open(prompt_path, 'w') as f:
            f.write(prompt_text)
        return new_version

# --- EXAMPLE USAGE ---
if __name__ == "__main__":
    prm = PromptRegistryManager()
    pkg = "001_identity_control_plane"
    print(f"Existing versions for {pkg}: {prm.list_versions(pkg)}")
    latest = prm.get_latest_version(pkg)
    print(f"Latest version: {latest}")
    prompt = prm.get_prompt(pkg)
    print(f"Prompt content (latest):
{prompt}")
    new_prompt = "Analyze this alert with updated logic and provide JSON decision."
    new_ver = prm.add_prompt_version(pkg, new_prompt)
    print(f"Added new prompt version: {new_ver}")
