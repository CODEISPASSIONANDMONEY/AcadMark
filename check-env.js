/**
 * Production Environment Checker
 * Verifies that all required environment variables are set
 */

const requiredEnvVars = [
  "DB_HOST",
  "DB_USER",
  "DB_PASSWORD",
  "DB_NAME",
  "SESSION_SECRET",
  "ADMIN_USER",
  "ADMIN_PASSWORD",
];

const optionalEnvVars = [
  "NODE_ENV",
  "PORT",
  "DB_PORT",
  "CAMPUS_LATITUDE",
  "CAMPUS_LONGITUDE",
  "CAMPUS_RADIUS_METERS",
];

console.log("\n🔍 AcadMark Production Environment Check\n");
console.log("=".repeat(50));

let allGood = true;

console.log("\n✅ Required Variables:");
requiredEnvVars.forEach((varName) => {
  const value = process.env[varName];
  if (!value) {
    console.log(`  ❌ ${varName}: NOT SET`);
    allGood = false;
  } else {
    // Mask sensitive values
    const displayValue = ["PASSWORD", "SECRET"].some((s) => varName.includes(s))
      ? "***" + value.slice(-4)
      : value;
    console.log(`  ✓ ${varName}: ${displayValue}`);
  }
});

console.log("\n📋 Optional Variables:");
optionalEnvVars.forEach((varName) => {
  const value = process.env[varName];
  if (!value) {
    console.log(`  ⚠️  ${varName}: Not set (using default)`);
  } else {
    console.log(`  ✓ ${varName}: ${value}`);
  }
});

console.log("\n" + "=".repeat(50));

if (allGood) {
  console.log("\n✅ All required environment variables are set!");
  console.log("   Your application is ready for production.\n");
  process.exit(0);
} else {
  console.log("\n❌ Missing required environment variables!");
  console.log("   Please set all required variables before deploying.\n");
  console.log("   See .env.example for reference.\n");
  process.exit(1);
}
