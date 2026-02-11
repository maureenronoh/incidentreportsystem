# GitHub Push Guide

## Prerequisites
- Git installed on your computer
- GitHub account created
- Repository created on GitHub

## Step 1: Initialize Git (if not already done)

```bash
git init
```

## Step 2: Add Remote Repository

Replace `yourusername` and `your-repo-name` with your actual GitHub username and repository name:

```bash
git remote add origin https://github.com/yourusername/your-repo-name.git
```

## Step 3: Check Status

```bash
git status
```

## Step 4: Add Files

Add all files:
```bash
git add .
```

Or add specific files:
```bash
git add backend_complete_simple.py
git add ireporter-frontend/
git add README.md
```

## Step 5: Commit Changes

```bash
git commit -m "Initial commit: iReporter application with notifications and analytics"
```

## Step 6: Push to GitHub

For first push:
```bash
git branch -M main
git push -u origin main
```

For subsequent pushes:
```bash
git push
```

## Common Git Commands

### Check current branch
```bash
git branch
```

### Create new branch
```bash
git checkout -b feature-name
```

### Switch branches
```bash
git checkout main
```

### Pull latest changes
```bash
git pull origin main
```

### View commit history
```bash
git log
```

### Undo last commit (keep changes)
```bash
git reset --soft HEAD~1
```

## Files Already Ignored

The following are automatically ignored (in .gitignore):
- `venv/` - Virtual environment
- `node_modules/` - Node packages
- `__pycache__/` - Python cache
- `.env` - Environment variables
- `*.log` - Log files
- `build/` - Build files
- `.vscode/` - IDE settings

## Troubleshooting

### Authentication Error
If you get authentication errors, you may need to use a Personal Access Token:

1. Go to GitHub Settings → Developer settings → Personal access tokens
2. Generate new token with `repo` scope
3. Use token as password when pushing

### Large Files Error
If you have large files, consider using Git LFS:
```bash
git lfs install
git lfs track "*.zip"
git add .gitattributes
```

### Merge Conflicts
If you have conflicts:
```bash
git pull origin main
# Resolve conflicts in files
git add .
git commit -m "Resolved merge conflicts"
git push
```

## Best Practices

1. **Commit Often**: Make small, focused commits
2. **Write Clear Messages**: Describe what changed and why
3. **Pull Before Push**: Always pull latest changes before pushing
4. **Use Branches**: Create feature branches for new work
5. **Review Changes**: Use `git diff` before committing

## Example Workflow

```bash
# Start new feature
git checkout -b add-email-notifications

# Make changes to files
# ...

# Check what changed
git status
git diff

# Stage changes
git add .

# Commit with descriptive message
git commit -m "Add email notification system"

# Push feature branch
git push -u origin add-email-notifications

# Create Pull Request on GitHub
# After review and merge, switch back to main
git checkout main
git pull origin main
```

## Useful Git Aliases

Add these to your `.gitconfig`:

```bash
git config --global alias.st status
git config --global alias.co checkout
git config --global alias.br branch
git config --global alias.ci commit
git config --global alias.unstage 'reset HEAD --'
```

Now you can use:
- `git st` instead of `git status`
- `git co` instead of `git checkout`
- `git br` instead of `git branch`
- `git ci` instead of `git commit`

## Ready to Push!

Your repository is now clean and ready to push to GitHub. Follow the steps above to get started!
