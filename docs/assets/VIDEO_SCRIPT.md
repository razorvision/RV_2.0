# Project Intake Template - Video Walkthrough Script

**Duration:** 8-10 minutes
**Target Audience:** Developers new to the template
**Recording Tool:** Loom, OBS, or screen recording of choice

---

## Pre-Recording Checklist

- [ ] Clean desktop/browser (no personal tabs)
- [ ] Terminal with clean history
- [ ] VS Code with template repo open
- [ ] GitHub logged in
- [ ] Claude Code installed and ready
- [ ] Microphone tested

---

## Video Outline

### Intro (30 seconds)

**On screen:** GitHub repo main page

**Script:**
> "Hey! In this video, I'll show you how to use the Project Intake Template to set up a new project with best practices in under 10 minutes.
>
> This template gives you GitHub labels, issue templates, PR templates, Claude Code integration, and comprehensive documentation - all pre-configured and ready to customize."

---

### Section 1: Create from Template (1.5 minutes)

**On screen:** GitHub repo page → "Use this template" button

**Actions:**
1. Click "Use this template" → "Create a new repository"
2. Fill in repository name: `my-awesome-project`
3. Select visibility (public/private)
4. Click "Create repository"
5. Show the new repo created

**Script:**
> "First, click 'Use this template' at the top of the repo. Give your project a name - I'll call mine 'my-awesome-project'. Choose public or private, then create.
>
> And just like that, you have a complete copy of the template with all the documentation and configuration."

---

### Section 2: Clone and Initial Setup (2 minutes)

**On screen:** Terminal

**Actions:**
```bash
git clone git@github.com:username/my-awesome-project.git
cd my-awesome-project
ls -la
```

**Script:**
> "Clone your new repo and take a look at what you've got. Notice the `.claude` folder for Claude Code config, `.github` for templates and workflows, and `docs` for comprehensive documentation."

**Actions:**
```bash
cp .env.example .env.local
cat .env.example
```

**Script:**
> "Copy the environment example file. This shows you all the variables you might need - database URL, auth secrets, API keys. The comments tell you exactly what each one does and where to get it."

**Actions:**
```bash
bash scripts/setup-labels.sh
```

**Script:**
> "Run the label setup script. This creates over 40 GitHub labels organized by priority, type, status, and more. Watch them appear... (pause) ...and done! Now your issues will be beautifully organized."

**On screen:** Show GitHub labels page (use captured screenshot or live)

---

### Section 3: Claude Code + MCP (2 minutes)

**On screen:** Terminal

**Actions:**
```bash
claude
```

**Script:**
> "Now let's fire up Claude Code. When you start it in this repo, it automatically detects the MCP server configuration."

**On screen:** MCP approval prompt

**Script:**
> "You'll see a prompt to approve the MCP servers - things like Playwright for browser automation, Git for repo operations, and more. Type 'yes' to approve them."

**Actions:**
```
/mcp
```

**Script:**
> "Run `/mcp` to see all available servers. Most work without any setup. The ones marked in yellow need API keys, which you can add later."

**Actions:**
```
/review-security
```

**Script:**
> "The template includes custom slash commands. Try `/review-security` to run a security audit, or `/create-component` to scaffold a React component. These are defined in the `.claude/commands` folder and you can add your own."

---

### Section 4: Documentation Tour (2 minutes)

**On screen:** VS Code with docs folder expanded

**Script:**
> "Let's look at the documentation structure. Everything is organized by purpose."

**Actions:** Navigate through folders, highlighting:
- `SETUP_CHECKLIST.md` - "Your single source of truth for setup"
- `docs/reference/ENV_VARIABLES.md` - "Every env var documented with where to get it"
- `docs/integrations/MCP_QUICKSTART.md` - "5-minute MCP setup"
- `docs/frameworks/AUTH_IMPLEMENTATION_GUIDE.md` - "Auth with a TL;DR at the top"

**Script:**
> "Notice how guides have quick-start sections at the top for when you just want to get going, with detailed explanations below for when you need them."

---

### Section 5: Project Board Setup (1.5 minutes)

**On screen:** GitHub repo → Projects tab

**Script:**
> "The template includes a project management guide for setting up GitHub Projects."

**Actions:**
1. Click Projects → New Project
2. Select Board view
3. Show the PROJECT_VIEWS_GUIDE.md for column setup

**Script:**
> "Follow the guide to create columns like Backlog, In Progress, Review, and Done. With the labels we created earlier, you can filter and organize issues beautifully."

---

### Section 6: What's Next (1 minute)

**On screen:** README.md decision tree

**Script:**
> "That's the core setup! From here, check out the feature guides table in the README. Need auth? There's a guide. Need Docker? There's a guide. Need testing? There's a complete testing template packet.
>
> The CLAUDE.md file in the root tells Claude Code how to work with your project - the change request workflow, coding standards, and more."

---

### Outro (30 seconds)

**On screen:** GitHub repo main page

**Script:**
> "That's it! You've got a fully configured project with:
> - 40+ GitHub labels
> - Issue and PR templates
> - Claude Code with MCP servers
> - Comprehensive documentation
>
> Star the repo if you found this helpful, and check out the full docs for everything else. Happy coding!"

---

## Post-Recording

1. **Edit:** Trim dead air, speed up typing sections (1.5x)
2. **Add:** Chapter markers at each section
3. **Export:** 1080p, high bitrate
4. **Upload:** YouTube (unlisted) or Loom
5. **Embed:** Add to README.md:

```markdown
## Video Walkthrough

[![Video Tutorial](docs/assets/screenshots/video-thumbnail.png)](https://youtube.com/watch?v=YOUR_VIDEO_ID)

*8-minute walkthrough of setting up a new project from this template*
```

---

## Recording Tips

- **Pace:** Speak slightly slower than normal - viewers can speed up
- **Mistakes:** It's okay to pause and retry - you can edit
- **Terminal:** Use a large font (14-16pt) so text is readable
- **Mouse:** Move cursor slowly and deliberately
- **Energy:** Sound enthusiastic but not over-the-top
