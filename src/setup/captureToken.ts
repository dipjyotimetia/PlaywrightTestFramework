/**
 * Standalone script to capture JWT token
 *
 * Usage:
 *   npx ts-node src/setup/captureToken.ts
 *
 * Or configure and run directly with custom settings
 */

import { AuthSetup, AuthConfig } from '../core/auth/authSetup';

async function main() {
  const authSetup = new AuthSetup();

  // Configure this based on your application
  const config: AuthConfig = {
    // Login page URL
    loginUrl: process.env.LOGIN_URL || 'https://example.com/login',

    // CSS selectors for login form
    usernameSelector: '#username', // Update to match your form
    passwordSelector: '#password', // Update to match your form
    submitSelector: 'button[type="submit"]', // Update to match your form

    // Credentials from environment variables
    username: process.env.TEST_USERNAME || '',
    password: process.env.TEST_PASSWORD || '',

    // Where to find the token
    // Options: 'localStorage', 'sessionStorage', 'cookie', 'header'
    tokenLocation: 'localStorage',

    // Key name in storage (required for localStorage/sessionStorage/cookie)
    tokenKey: 'authToken', // or 'token', 'access_token', etc.

    // Expected URL after successful login (optional)
    expectedUrlAfterLogin: process.env.AFTER_LOGIN_URL || 'https://example.com/dashboard',

    // Run headless (set to true in CI)
    headless: process.env.HEADLESS === 'true',
  };

  try {
    console.log('🔐 Starting token capture...');
    console.log(`📍 Login URL: ${config.loginUrl}`);
    console.log(`👤 Username: ${config.username}`);
    console.log(`📦 Token location: ${config.tokenLocation}`);

    if (!config.username || !config.password) {
      console.error('❌ Error: TEST_USERNAME and TEST_PASSWORD environment variables are required');
      console.error('Set them in your .env file or export them:');
      console.error('  export TEST_USERNAME=your-email@example.com');
      console.error('  export TEST_PASSWORD=your-password');
      process.exit(1);
    }

    const tokenData = await authSetup.captureToken(config);

    if (tokenData) {
      console.log('✅ Token captured successfully!');
      console.log(`📝 Token saved to: .auth/tokens.json`);
      console.log(`⏰ Captured at: ${new Date(tokenData.capturedAt).toLocaleString()}`);

      if (tokenData.expiresAt) {
        console.log(`⏳ Expires at: ${new Date(tokenData.expiresAt).toLocaleString()}`);
      }

      console.log('\n🚀 You can now run your API tests with the captured token!');
      console.log('   npx playwright test jwt-api-test.test.spec.ts');
    } else {
      console.error('❌ Failed to capture token');
      process.exit(1);
    }
  } catch (error) {
    console.error('❌ Error capturing token:', error);
    process.exit(1);
  }
}

// Run if executed directly
if (require.main === module) {
  main();
}

export { main };
