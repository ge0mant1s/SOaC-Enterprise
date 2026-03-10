# Contributing to SOaC-Enterprise

First off, thank you for considering contributing to SOaC-Enterprise. It's people like you that make SOaC-Enterprise such a great tool for the security community.

## Code of Conduct

This project and everyone participating in it is governed by the [SOaC-Enterprise Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code. Please report unacceptable behavior to [INSERT EMAIL ADDRESS].

## How Can I Contribute?

### Reporting Bugs

This section guides you through submitting a bug report for SOaC-Enterprise. Following these guidelines helps maintainers and the community understand your report, reproduce the behavior, and find related reports.

**Before Submitting A Bug Report**
- Check the [issues list](https://github.com/your-org/SOaC-Enterprise/issues) to see if the problem has already been reported.
- Perform a cursory search to see if the problem has already been fixed.

**How Do I Submit A (Good) Bug Report?**
Bugs are tracked as GitHub issues. Create an issue and provide the following information:
- **Use a clear and descriptive title** for the issue to identify the problem.
- **Describe the exact steps which reproduce the problem** in as many details as possible.
- **Provide specific examples to demonstrate the steps**.
- **Describe the behavior you observed after following the steps** and point out what exactly is the problem with that behavior.
- **Explain which behavior you expected to see instead and why.**

### Suggesting Enhancements

This section guides you through submitting an enhancement suggestion for SOaC-Enterprise, including completely new features and minor improvements to existing functionality.

**Before Submitting An Enhancement Suggestion**
- Check the [issues list](https://github.com/your-org/SOaC-Enterprise/issues) to see if the enhancement has already been suggested.
- Perform a cursory search to see if the enhancement has already been implemented.

**How Do I Submit A (Good) Enhancement Suggestion?**
Enhancement suggestions are tracked as GitHub issues. Create an issue and provide the following information:
- **Use a clear and descriptive title** for the issue to identify the suggestion.
- **Provide a step-by-step description of the suggested enhancement** in as many details as possible.
- **Provide specific examples to demonstrate the steps**.
- **Describe the current behavior and explain which behavior you expected to see instead** and why.

### Your First Code Contribution

Unsure where to begin contributing to SOaC-Enterprise? You can start by looking through these \`beginner\` and \`help-wanted\` issues:
- [Beginner issues][beginner] - issues which should only require a few lines of code, and a test or two.
- [Help wanted issues][help-wanted] - issues which should be a bit more involved than \`beginner\` issues.

### Pull Requests

The process described here has several goals:
- Maintain SOaC-Enterprise's quality
- Fix problems that are important to users
- Engage the community in working toward the best possible SOaC-Enterprise
- Enable a sustainable system for SOaC-Enterprise's maintainers to review contributions

Please follow these steps to have your contribution considered by the maintainers:
1. Follow all instructions in [the template](PULL_REQUEST_TEMPLATE.md)
2. After you submit your pull request, verify that all [status checks](https://help.github.com/articles/about-status-checks/) are passing.

While the prerequisites above must be satisfied prior to having your pull request reviewed, the reviewer(s) may ask you to complete additional design work, tests, or other changes before your pull request can be ultimately accepted.

## Styleguides

### Git Commit Messages

- Use the present tense ("Add feature" not "Added feature")
- Use the imperative mood ("Move cursor to..." not "Moves cursor to...")
- Limit the first line to 72 characters or less
- Reference issues and pull requests liberally after the first line

### Python Styleguide

All Python code must adhere to [PEP 8](https://pep8.org/).

### Documentation Styleguide

- Use [Markdown](https://daringfireball.net/projects/markdown/).
- Reference methods and classes in markdown with the custom `{}` notation:
  - Reference classes with \`{Class}\`
  - Reference instance methods with \`{Class.method}\`
  - Reference class methods with \`{Class.classmethod}\`

## Additional Notes

### Issue and Pull Request Labels

This section lists the labels we use to help us track and manage issues and pull requests.

[GitHub search](https://help.github.com/articles/searching-issues/) makes it easy to use labels for finding groups of issues or pull requests you're interested in.

The labels are loosely grouped by their purpose, but it's not required to have one label from every group or to have all the grouping labels.

#### Type of Issue and Issue State

- \`bug\` - Issues that are bugs.
- \`enhancement\` - Issues that are feature requests.
- \`documentation\` - Issues for improving documentation.
- \`beginner\` - Issues that are good for beginners.
- \`help-wanted\` - Issues that need assistance from the community.

[beginner]:https://github.com/your-org/SOaC-Enterprise/issues?utf8=%E2%9C%93&q=is%3Aissue+is%3Aopen+label%3Abeginner
[help-wanted]:https://github.com/your-org/SOaC-Enterprise/issues?q=is%3Aissue+is%3Aopen+label%3A"help+wanted"
