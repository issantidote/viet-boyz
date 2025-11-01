/**
 * Generate bcrypt password hashes for test users
 * 
 * Usage: node generate_hash.js
 * 
 * This will generate password hashes that can be used in SQL
 * to create test users.
 */

const bcrypt = require('bcrypt');

async function generateHash(label, password) {
  try {
    const hash = await bcrypt.hash(password, 10);
    console.log(`\n${label}:`);
    console.log(`  Password: ${password}`);
    console.log(`  Hash: ${hash}`);
    console.log(`  SQL: INSERT INTO LoginInfo (Email, UserPass, UserRole) VALUES ('email@example.com', '${hash}', 'Volunteer');`);
    return hash;
  } catch (error) {
    console.error(`Error generating hash for ${label}:`, error);
  }
}

async function main() {
  console.log('='.repeat(80));
  console.log('Bcrypt Password Hash Generator');
  console.log('='.repeat(80));
  
  await generateHash('Admin User', 'admin_123');
  await generateHash('Volunteer User', 'volunteer_123');
  await generateHash('Test User', 'test123');
  
  console.log('\n' + '='.repeat(80));
  console.log('Copy the hash value and use it in your SQL INSERT statement.');
  console.log('The hash includes the $2b$ prefix which bcrypt requires.');
  console.log('='.repeat(80) + '\n');
}

main();


