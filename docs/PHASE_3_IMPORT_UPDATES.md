# Phase 3: Import Path Updates

## Files Requiring Import Updates

### ✅ Completed

1. **src/core/actions/api/apiActions.ts**
   - ✅ Updated: `'./tokenManager'` → `'../../auth/tokenManager'`

2. **src/tests/api/auth/jwt-token-capture.test.spec.ts**
   - ✅ Updated: `'../core/authSetup'` → `'../../../core/auth/authSetup'`
   - ✅ Updated: `'../core/tokenManager'` → `'../../../core/auth/tokenManager'`

### 🔄 Remaining Test Files

Update these files with new import paths:

#### API Tests
- `src/tests/api/auth/jwt-api-test.test.spec.ts`
  - Update: `'../../core/apiActions'` → `'../../../core/actions/api/apiActions'`
  - Update: `'../../core/authHelper'` → `'../../../core/auth/authHelper'`

- `src/tests/api/examples/api-examples.test.spec.ts`
  - Update: `'../../core/apiActions'` → `'../../../core/actions/api/apiActions'`

- `src/tests/api/examples/api-redirect.test.spec.ts`
  - Update imports if any

- `src/tests/api/api.test.spec.ts`
  - Update: `'../core/apiActions'` → `'../../core/actions/api/apiActions'`

#### E2E Tests
- `src/tests/e2e/examples/web-actions-examples.test.spec.ts`
  - Update: `'../../core/webActions'` → `'../../../core/actions/web/webActions'`

#### Accessibility Tests
- `src/tests/accessibility/accessibility.test.spec.ts`
  - Update: `'../core/a11yActions'` → `'../../core/actions/web/a11yActions'`

#### Other Files
- `src/setup/captureToken.ts`
  - Update: `'../core/authSetup'` → `'../core/auth/authSetup'`

- `src/pages/login.ts` & `src/pages/products.ts`
  - Check if they need updates

## Quick Fix Script

Run this to update all remaining imports automatically:

```bash
# Update API test imports
find src/tests/api -name "*.ts" -exec sed -i '' "s|from '../../core/apiActions'|from '../../../core/actions/api/apiActions'|g" {} \;
find src/tests/api -name "*.ts" -exec sed -i '' "s|from '../../../core/authHelper'|from '../../../core/auth/authHelper'|g" {} \;
find src/tests/api -name "*.ts" -exec sed -i '' "s|from '../../../core/authSetup'|from '../../../core/auth/authSetup'|g" {} \;

# Update E2E test imports
find src/tests/e2e -name "*.ts" -exec sed -i '' "s|from '../../core/webActions'|from '../../../core/actions/web/webActions'|g" {} \;

# Update accessibility test imports
find src/tests/accessibility -name "*.ts" -exec sed -i '' "s|from '../core/a11yActions'|from '../../core/actions/web/a11yActions'|g" {} \;
find src/tests/accessibility -name "*.ts" -exec sed -i '' "s|from '../core/webActions'|from '../../core/actions/web/webActions'|g" {} \;
find src/tests/accessibility -name "*.ts" -exec sed -i '' "s|from '../core/cookieActions'|from '../../core/actions/web/cookieActions'|g" {} \;

# Update setup imports
sed -i '' "s|from '../core/authSetup'|from '../core/auth/authSetup'|g" src/setup/captureToken.ts
```

**Note:** On Linux, use `sed -i` instead of `sed -i ''`

## Verification

After updating imports:

```bash
# Check TypeScript compilation
pnpm run typecheck

# List tests
npm test -- --list

# Run a sample test
npm test -- src/tests/api/auth/jwt-token-capture.test.spec.ts
```
