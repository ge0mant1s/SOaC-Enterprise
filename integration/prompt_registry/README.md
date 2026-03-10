# Prompt Registry Manager

This module provides a versioned prompt registry for the SOaC Brain.

## Purpose

- Manage multiple versions of AI reasoning prompts per threat package.
- Enable rollback, A/B testing, and controlled rollout of prompt updates.

## Directory Structure

```
integration/prompt_registry/
  └── prompts/
      └── <package_id>/
          ├── v1.txt
          ├── v2.txt
          └── ...
```

## Usage

```python
from prompt_registry_manager import PromptRegistryManager

prm = PromptRegistryManager()

# List all versions for a package
versions = prm.list_versions('001_identity_control_plane')

# Get the latest prompt
prompt = prm.get_prompt('001_identity_control_plane')

# Get a specific version
prompt_v1 = prm.get_prompt('001_identity_control_plane', 'v1.txt')

# Add a new prompt version
new_version = prm.add_prompt_version('001_identity_control_plane', 'New prompt text here')
```

## Integration with Brain Connector

Modify the Brain Connector to fetch prompts from the Prompt Registry instead of static files.

## Best Practices

- Always add a new version when updating prompts.
- Use semantic versioning in filenames if desired (e.g., v1.0.txt).
- Keep prompts concise and focused on the package's threat model.

## Contribution

Contributions to improve prompt quality and versioning are welcome.
