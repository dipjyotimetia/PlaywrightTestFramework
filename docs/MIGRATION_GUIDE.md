# Migration Guide - Project Restructuring

## Overview

This guide helps you migrate the project to the new improved structure. The migration is divided into phases that can be executed incrementally.

## ✅ Completed Phases

### Phase 1: Documentation Reorganization ✅
**Status:** COMPLETED

**Changes:**
- Created `docs/` directory structure
- Moved all documentation files:
  - `API_FUNCTIONS_REFERENCE.md` → `docs/api/`
  - `JWT_TOKEN_AUTH.md` → `docs/api/`
  - `WEB_ACTIONS_REFERENCE.md` → `docs/web/`
  - `ENHANCEMENTS.md` → `docs/`
  - `PROJECT_STRUCTURE_IMPROVEMENT_PLAN.md` → `docs/architecture/`
- Created new guides:
  - `docs/guides/GETTING_STARTED.md`
  - `docs/guides/BEST_PRACTICES.md`

**Action Required:** None - Documentation moved successfully

---

## ⏳ Pending Phases

The following phases require careful execution to avoid breaking changes. Each phase includes specific instructions and verification steps.

### Phase 2: Configuration Consolidation
**Priority:** HIGH | **Risk:** MEDIUM

**Manual Steps Required:**

1. **Create config directory:**
```bash
mkdir -p config/environments
```

2. **Move configuration files:**
```bash
# NOTE: Do NOT execute these yet - imports need to be updated first
# git mv playwright.config.ts config/
# git mv reportConfig.ts config/reporter.config.ts
# git mv tsconfig.json config/
```

3. **Update package.json scripts:**
```json
{
  "scripts": {
    "test:playwright": "playwright test --config=config/playwright.config.ts --headed"
  }
}
```

4. **Update import paths in all files that reference configs**

**Verification:**
```bash
npx playwright test --dry-run
pnpm run lint
```

---

### Phase 3: Source Code Reorganization
**Priority:** MEDIUM | **Risk:** HIGH

⚠️ **WARNING:** This phase involves moving many files and updating imports. Recommend doing this in a separate branch.

#### Phase 3A: Create New Directories

```bash
# Create new directory structure
mkdir -p src/{constants,models,fixtures,utils,services}
mkdir -p src/core/{actions/{api,web,mock},auth,browser,reporting}
mkdir -p src/tests/{api,e2e,accessibility,integration,visual}
mkdir -p src/test-data/{mocks,fixtures,csv}
```

#### Phase 3B: Move Core Files

**Auth files:**
```bash
git mv src/core/authSetup.ts src/core/auth/
git mv src/core/authHelper.ts src/core/auth/
git mv src/core/tokenManager.ts src/core/auth/
```

**Action files:**
```bash
git mv src/core/apiActions.ts src/core/actions/api/
git mv src/core/webActions.ts src/core/actions/web/
git mv src/core/a11yActions.ts src/core/actions/web/
git mv src/core/cookieActions.ts src/core/actions/web/
git mv src/core/mockActions.ts src/core/actions/mock/
```

#### Phase 3C: Move Test Files

**API tests:**
```bash
mkdir -p src/tests/api/{auth,examples}
git mv src/tests/jwt-token-capture.test.spec.ts src/tests/api/auth/
git mv src/tests/jwt-api-test.test.spec.ts src/tests/api/auth/
git mv src/tests/api-examples.test.spec.ts src/tests/api/examples/
git mv src/tests/api-redirect.test.spec.ts src/tests/api/examples/
git mv src/tests/api.test.spec.ts src/tests/api/
```

**E2E tests:**
```bash
mkdir -p src/tests/e2e/{examples}
git mv src/tests/sause.test.spec.ts src/tests/e2e/
git mv src/tests/web-actions-examples.test.spec.ts src/tests/e2e/examples/
```

**Accessibility tests:**
```bash
git mv src/tests/accessibility.test.spec.ts src/tests/accessibility/
git mv src/tests/aria-snapshots.test.spec.ts src/tests/accessibility/
git mv src/tests/partitioned-cookies.test.spec.ts src/tests/accessibility/
```

#### Phase 3D: Move Test Data

```bash
git mv mocks src/test-data/
```

**After Moving Files:** All import paths need to be updated!

---

## Import Path Update Strategy

### Option 1: Manual Update (Recommended for Small Projects)

Use Find & Replace in your IDE:

1. Update auth imports:
```typescript
// FROM:
import { authHelper } from '../core/authHelper';
import { TokenManager } from '../core/tokenManager';

// TO:
import { authHelper } from '../core/auth/authHelper';
import { TokenManager } from '../core/auth/tokenManager';
```

2. Update action imports:
```typescript
// FROM:
import { httpGet, httpPost } from '../core/apiActions';

// TO:
import { httpGet, httpPost } from '../core/actions/api/apiActions';
```

3. Update web action imports:
```typescript
// FROM:
import { clickElement, fillInputField } from '../core/webActions';

// TO:
import { clickElement, fillInputField } from '../core/actions/web/webActions';
```

### Option 2: Automated Script (For Large Projects)

Create a migration script to update imports automatically.

---

## Post-Migration Checklist

After completing each phase:

- [ ] Run TypeScript compiler: `npx tsc --noEmit`
- [ ] Run linter: `pnpm run lint`
- [ ] Run all tests: `npx playwright test`
- [ ] Check for broken imports
- [ ] Verify CI/CD pipeline
- [ ] Update documentation if needed
- [ ] Commit changes with descriptive message

---

## Rollback Strategy

If issues occur during migration:

1. **Git Checkout:**
```bash
git checkout -- .
git clean -fd
```

2. **Restore from backup:**
```bash
git stash
# or
git reset --hard HEAD
```

3. **Branch Strategy:**
Always work in a feature branch:
```bash
git checkout -b feature/project-restructure
# Make changes
# If issues occur:
git checkout master
git branch -D feature/project-restructure
```

---

## Recommended Approach

### Conservative Migration (Recommended)

Execute phases incrementally with verification:

1. ✅ **Phase 1: Documentation** (COMPLETED)
2. **Phase 2: Configuration** (Next - Low Risk)
3. **Phase 3A: Create Directories** (Preparation)
4. **Phase 3B: Move Core Files** (Test after each group)
5. **Phase 3C: Move Test Files** (Test after each group)
6. **Phase 3D: Move Test Data**
7. **Update All Imports**
8. **Full Testing**
9. **Update Documentation**

### Aggressive Migration (For Experienced Teams)

Execute all phases at once in a feature branch, then test thoroughly before merging.

---

## Current Status

### Completed ✅
- Phase 1: Documentation Reorganization

### In Progress 🔄
- Awaiting approval to proceed with Phase 2

### Pending ⏳
- Phase 2: Configuration Consolidation
- Phase 3: Source Code Reorganization
- Phase 4: Missing Components
- Phase 5: Import Path Updates
- Phase 6: Testing & Verification

---

## Need Help?

- Review the full plan: `docs/architecture/PROJECT_STRUCTURE_IMPROVEMENT_PLAN.md`
- Check best practices: `docs/guides/BEST_PRACTICES.md`
- Getting started: `docs/guides/GETTING_STARTED.md`

---

**⚠️ IMPORTANT:**
- Always work in a feature branch
- Test after each phase
- Keep backups
- Update documentation as you go
