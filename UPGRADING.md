# Upgrading bacon

> **Read this first:** If you haven't started building yet, consider cloning a fresh copy of bacon instead of upgrading. See [Fork vs Template](#fork-vs-template) below.

bacon is a **starter template**, not a library or framework dependency. There is no `npm update bacon` or `pnpm up bacon` — you own the code the moment you fork it. This guide explains how to incorporate upstream changes when you want to benefit from bug fixes, new features, or improvements in the origin repository.

---

## Fork vs Template

There are two ways to start a project from bacon:

| Approach | Use Case | Upgrade Strategy |
|----------|----------|------------------|
| **Fork and maintain** | You want to keep pulling upstream changes over time | Rebasing or cherry-picking (this guide) |
| **Template (clone + detach)** | You want a one-time starting point, then go your own way | No upgrade path needed |

**If you used the "template" approach** (cloned the repo and deleted the `.git` directory or reset the origin), you have no git history link to bacon. You can still manually reapply changes, but automated upgrading is not possible. This is fine — bacon is designed to be a complete starting point, and many teams never need upstream updates once their product diverges significantly.

**If you forked** (GitHub fork or `git clone` with the origin pointing to the original repo), you can pull upstream changes via standard git operations.

---

## Checking for Updates

Before you start, check what has changed upstream:

```sh
# Add the original bacon repo as an upstream remote (one-time)
git remote add upstream https://github.com/vncsleal/bacon.git

# Fetch the latest upstream changes
git fetch upstream

# See what's new (commits on main that you don't have)
git log --oneline HEAD..upstream/main

# See what files changed
git diff --stat HEAD..upstream/main
```

## Upgrade Strategies

Pick the strategy that matches how much you've diverged from upstream bacon.

### Strategy A: Cherry-pick specific changes (recommended)

If you only want certain features or fixes, cherry-pick individual commits:

```sh
# Fetch upstream
git fetch upstream

# Cherry-pick specific commits by SHA
git cherry-pick <commit-sha>

# Resolve conflicts if any, then continue
git cherry-pick --continue
```

**Best for:** Targeted upgrades, single features, critical bug fixes.

**Pros:** Minimal disruption, you control exactly what changes.
**Cons:** Requires reviewing individual commits. You might miss related changes if commits are not atomic.

### Strategy B: Rebase your branch on upstream

If you want to absorb all upstream changes since your last sync:

```sh
# Assuming you're on your main branch
git checkout main

# Fetch and rebase
git fetch upstream
git rebase upstream/main

# Force-push only if you're working alone or have coordinated with your team
git push --force-with-lease
```

**Best for:** Early-stage projects that haven't diverged much from bacon.

**Pros:** Clean linear history, all upstream changes applied.
**Cons:** Rewrites history — problematic for shared branches. Can produce complex merge conflicts if you've made significant changes.

### Strategy C: Merge upstream (team-friendly)

If you're working with a team and cannot rebase:

```sh
git fetch upstream
git checkout main
git merge upstream/main
git push
```

**Best for:** Teams, shared branches, long-lived forks.

**Pros:** Preserves history, no force-push needed.
**Cons:** Creates merge commits. History can become cluttered over time.

---

## Handling Conflicts

Conflicts are inevitable when upstream bacon changes overlap with your customizations.

### Common conflict patterns

| Pattern | Likelihood | How to Handle |
|---------|------------|---------------|
| **`packages/*/package.json`** | High | Keep your dependency versions unless you specifically want the upstream version. Pay attention to peer dependency ranges. |
| **`packages/database/convex/schema.ts`** | High | If you added your own tables, conflicts are in the schema definition. Keep your additions, accept upstream changes to existing definitions. |
| **`apps/app/app/**`** | Medium | Route files and pages you've customized will conflict. Review each change. |
| **`.env.example`** | Low | Usually additive (new variables added). Accept all upstream additions. |
| **Configuration files (`turbo.json`, `tsconfig.json`)** | Low-Medium | Accept upstream unless you intentionally changed build settings. |

### Conflict resolution workflow

1. **Inspect the conflict markers** — understand what upstream changed vs what you changed
2. **Keep your business logic** — your data models, custom pages, and product-specific code should always win
3. **Accept upstream infrastructure** — build config, CI workflows, package updates, and security improvements are usually worth adopting
4. **Test thoroughly** — after resolving, run `pnpm install`, `pnpm build`, `pnpm test`

```sh
# After a conflicted rebase or merge
pnpm install          # Resolve any dependency conflicts
pnpm run build        # Ensure everything compiles
pnpm -r typecheck     # Check types across all packages
pnpm test             # Run tests
```

---

## Breaking Changes

bacon follows [Semantic Versioning](https://semver.org/) (semver). Major version bumps (1.x → 2.x) may include breaking changes. Each release notes will document:

1. **What changed** — the specific files or APIs affected
2. **Migration path** — step-by-step instructions to update your code
3. **Reason** — why the change was necessary

### How to prepare for breaking changes

- Subscribe to [GitHub Releases](https://github.com/vncsleal/bacon/releases) for notifications
- Review the release notes before upgrading
- Keep your changes isolated from bacon's "infrastructure" code when possible:
  - Add your business logic in new files rather than modifying existing ones
  - Extend types and interfaces instead of changing them
  - Wrap imported functions if you need different behavior

### Past breaking changes

| Version | Change | Migration |
|---------|--------|-----------|
| v0.1 → v0.2 | N/A | N/A |

(No breaking changes have occurred yet — this section will be updated with each major release.)

---

## Tracking Your Divergence

Over time, your fork will diverge from upstream bacon. This is expected — your product is not bacon, bacon is just your starting point.

**Keep a changelog** — maintain a `CHANGELOG.md` or `UPGRADING_LOCAL.md` that records your customizations so you can quickly identify what might conflict during an upgrade.

**Track upstream in your CI** — consider a weekly workflow that checks `git rev-list --count HEAD..upstream/main` and alerts you if the count grows beyond a threshold.

---

## When Not to Upgrade

Sometimes the right call is to skip an upgrade:

- **You're nearing a launch** — don't destabilize your project. Lock the version and plan an upgrade after shipping
- **The change doesn't affect you** — if the upstream change is in a module you're not using, there's no benefit
- **Your divergence is too large** — if you've significantly restructured the project, the cost of merging conflicts may exceed the value of the changes

In all these cases, you can still cherry-pick individual security fixes or dependency bumps without taking the full upgrade.

---

## Getting Help

- **GitHub Issues**: [Open an issue](https://github.com/vncsleal/bacon/issues) for upgrade problems
- **Discussions**: Use GitHub Discussions for upgrade strategy questions
- **Release notes**: Check [GitHub Releases](https://github.com/vncsleal/bacon/releases) for detailed changelogs
