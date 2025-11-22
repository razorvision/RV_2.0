# Scripts & Automation

Automation scripts and utilities for the project-intake-template repository.

## 📜 Available Scripts

### Label Setup Scripts

**setup-labels.sh** (Mac/Linux/Git Bash)
```bash
bash setup-labels.sh
```

**setup-labels.bat** (Windows)
```bash
setup-labels.bat
```

Creates the complete label system for GitHub issues:
- Priority labels (high, medium, low)
- Type labels (feature, bug, docs, refactor, test)
- Status labels (blocked, in-progress, needs-review, ready)
- Effort labels (small, medium, large)
- Phase labels (1, 2, 3)
- Client visibility labels

**Requirements:** GitHub CLI (`gh`) must be installed and authenticated

### Tools Directory

Additional automation utilities in [`tools/`](tools/):
- `convert_drafts_to_issues.py` - Convert draft issues to GitHub issues
- `create_issue.sh` - Create GitHub issues via CLI
- `work-epic-issue.sh` - Workflow automation for epics

## 🚀 Usage

### First-Time Setup

1. **Install GitHub CLI:**
   ```bash
   # Mac
   brew install gh

   # Windows (via winget)
   winget install --id GitHub.cli

   # Linux
   # See: https://github.com/cli/cli/blob/trunk/docs/install_linux.md
   ```

2. **Authenticate:**
   ```bash
   gh auth login
   ```

3. **Run label setup:**
   ```bash
   # Mac/Linux
   bash scripts/setup-labels.sh

   # Windows
   scripts\setup-labels.bat
   ```

### Converting Draft Issues

```bash
python scripts/tools/convert_drafts_to_issues.py
```

### Creating Issues via CLI

```bash
bash scripts/tools/create_issue.sh "Issue title" "Issue body"
```

## 📝 Script Details

### setup-labels.sh / .bat

Creates a complete GitHub label system with:
- **13 priority/type labels** for categorization
- **7 status labels** for workflow tracking
- **3 effort labels** for estimation
- **3 phase labels** for project planning
- **2 client visibility labels**

All labels include descriptions and appropriate color coding.

### convert_drafts_to_issues.py

Converts locally drafted issues to GitHub issues:
- Reads draft files from specified directory
- Parses title, body, labels, and metadata
- Creates issues via GitHub API
- Supports batch processing

### create_issue.sh

Quick CLI wrapper for creating issues:
- Simple interface for common issue creation
- Uses GitHub CLI (`gh issue create`)
- Supports labels, milestones, assignees

### work-epic-issue.sh

Workflow automation for epic-level issues:
- Links related issues
- Updates epic progress
- Manages epic status

## 🔧 Customization

### Modifying Labels

Edit `setup-labels.sh` or `setup-labels.bat`:
```bash
gh label create "custom-label" \
  --description "Custom label description" \
  --color "HEXCODE"
```

### Adding New Scripts

1. Create script in `scripts/` or `scripts/tools/`
2. Make executable: `chmod +x script-name.sh`
3. Document in this README
4. Add usage examples

## 🐛 Troubleshooting

**"gh: command not found"**
- Install GitHub CLI (see First-Time Setup above)

**"authentication required"**
- Run: `gh auth login`
- Follow authentication prompts

**"permission denied"**
- Make script executable: `chmod +x scripts/setup-labels.sh`

**Script fails on Windows**
- Use Git Bash or Windows Subsystem for Linux (WSL)
- Or use the .bat version where available

## 📚 Related Documentation

- [GitHub CLI Documentation](https://cli.github.com/manual/)
- [GitHub Labels Guide](https://docs.github.com/en/issues/using-labels-and-milestones-to-track-work)
- [Project Management Guide](../.github/PROJECT_MANAGEMENT_GUIDE.md)

---

**Need help?** Open an issue or check the main [README.md](../README.md)
