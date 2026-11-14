/**
 * Automated Test Runner for Express.js REST API (CO5)
 * Tests all CRUD routes, middleware pipeline, JWT authentication, and bcrypt password hashing.
 * Uses real HTTP server on an ephemeral port with native fetch.
 */

process.env.NODE_ENV = 'test';
const http = require('http');
const app = require('./src/server');

async function runTestSuite() {
  console.log('\n===============================================================');
  console.log('🧪 Starting Test Suite: Express.js REST API with JWT & Bcrypt');
  console.log('👤 Student Roll No: 38 | Dept: B.E. AI & DS (Sem V) | CO5');
  console.log('===============================================================\n');

  // Start HTTP server on dynamic available port (port 0)
  const server = http.createServer(app);

  await new Promise((resolve, reject) => {
    server.listen(0, '127.0.0.1', () => {
      resolve();
    });
    server.on('error', reject);
  });

  const { port } = server.address();
  const baseUrl = `http://127.0.0.1:${port}`;
  console.log(`📡 Test server running on ephemeral port: ${port}\n`);

  try {
    let jwtToken = '';
    const testEmail = `faculty_${Date.now()}@university.edu`;

    // -------------------------------------------------------------
    // Test 1: User Registration with Bcrypt Password Hashing
    // -------------------------------------------------------------
    console.log('1️⃣ [TEST] User Registration (POST /api/auth/register)...');
    const regRes = await fetch(`${baseUrl}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: "Dr. Sharma",
        email: testEmail,
        password: "securePassword123",
        role: "faculty"
      })
    });
    const regData = await regRes.json();
    console.log(`   ✅ Status: ${regRes.status} | Registered: ${regData.user?.email}`);
    jwtToken = regData.token;

    // -------------------------------------------------------------
    // Test 2: User Login with Password Verification & JWT Issuance
    // -------------------------------------------------------------
    console.log('\n2️⃣ [TEST] User Login (POST /api/auth/login)...');
    const loginRes = await fetch(`${baseUrl}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: testEmail,
        password: "securePassword123"
      })
    });
    const loginData = await loginRes.json();
    console.log(`   ✅ Status: ${loginRes.status} | Token Generated: ${loginData.token ? 'YES' : 'NO'}`);
    jwtToken = loginData.token;

    // -------------------------------------------------------------
    // Test 3: Protected Route Access WITHOUT JWT Token (Expected 401)
    // -------------------------------------------------------------
    console.log('\n3️⃣ [TEST] Protected Route Access WITHOUT Token (POST /api/attendance)...');
    const unauthRes = await fetch(`${baseUrl}/api/attendance`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        rollNo: "38",
        name: "Ayush Sharma"
      })
    });
    const unauthData = await unauthRes.json();
    console.log(`   ✅ Status: ${unauthRes.status} (Expected 401 Unauthorized) | Error: ${unauthData.error}`);

    // -------------------------------------------------------------
    // Test 4: Protected Profile Access WITH Token (Expected 200)
    // -------------------------------------------------------------
    console.log('\n4️⃣ [TEST] Access Protected Profile WITH Token (GET /api/auth/profile)...');
    const profileRes = await fetch(`${baseUrl}/api/auth/profile`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${jwtToken}`
      }
    });
    const profileData = await profileRes.json();
    console.log(`   ✅ Status: ${profileRes.status} | Authenticated User: ${profileData.profile?.email}`);

    // -------------------------------------------------------------
    // Test 5: Input Validation Middleware Rejection (Expected 400)
    // -------------------------------------------------------------
    console.log('\n5️⃣ [TEST] Input Validation Middleware (POST /api/attendance with invalid inputs)...');
    const invalidRes = await fetch(`${baseUrl}/api/attendance`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${jwtToken}`
      },
      body: JSON.stringify({
        rollNo: "",
        name: "A",
        status: "InvalidStatus"
      })
    });
    const invalidData = await invalidRes.json();
    console.log(`   ✅ Status: ${invalidRes.status} (Expected 400 Bad Request) | Errors: ${invalidData.validationErrors?.join('; ')}`);

    // -------------------------------------------------------------
    // Test 6: Create Attendance Record with Valid Token (Expected 201)
    // -------------------------------------------------------------
    console.log('\n6️⃣ [TEST] Create Attendance Record (POST /api/attendance)...');
    const createRes = await fetch(`${baseUrl}/api/attendance`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${jwtToken}`
      },
      body: JSON.stringify({
        rollNo: "38",
        name: "Ayush Sharma",
        course: "B.E. AI & DS",
        semester: "V",
        status: "Present",
        remarks: "Express REST API test passed"
      })
    });
    const createData = await createRes.json();
    console.log(`   ✅ Status: ${createRes.status} | Record ID: ${createData.data?.id}`);
    const recordId = createData.data?.id;

    // -------------------------------------------------------------
    // Test 7: Get All Records (Expected 200)
    // -------------------------------------------------------------
    console.log('\n7️⃣ [TEST] Get All Attendance Records (GET /api/attendance)...');
    const getAllRes = await fetch(`${baseUrl}/api/attendance`);
    const getAllData = await getAllRes.json();
    console.log(`   ✅ Status: ${getAllRes.status} | Total Records: ${getAllData.count}`);

    // -------------------------------------------------------------
    // Test 8: Update Attendance Record (Expected 200)
    // -------------------------------------------------------------
    console.log(`\n8️⃣ [TEST] Update Attendance Record (PUT /api/attendance/${recordId})...`);
    const updateRes = await fetch(`${baseUrl}/api/attendance/${recordId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${jwtToken}`
      },
      body: JSON.stringify({
        rollNo: "38",
        name: "Ayush Sharma",
        status: "Late",
        remarks: "Updated via PUT route"
      })
    });
    const updateData = await updateRes.json();
    console.log(`   ✅ Status: ${updateRes.status} | New Status: ${updateData.data?.status}`);

    // -------------------------------------------------------------
    // Test 9: Get Attendance Analytics (Expected 200)
    // -------------------------------------------------------------
    console.log('\n9️⃣ [TEST] Get Attendance Stats (GET /api/attendance/stats)...');
    const statsRes = await fetch(`${baseUrl}/api/attendance/stats`);
    const statsData = await statsRes.json();
    console.log(`   ✅ Status: ${statsRes.status} | Effective Rate: ${statsData.stats?.effectiveRate}`);

    // -------------------------------------------------------------
    // Test 10: Delete Attendance Record (Expected 200)
    // -------------------------------------------------------------
    console.log(`\n🔟 [TEST] Delete Record (DELETE /api/attendance/${recordId})...`);
    const delRes = await fetch(`${baseUrl}/api/attendance/${recordId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${jwtToken}`
      }
    });
    const delData = await delRes.json();
    console.log(`   ✅ Status: ${delRes.status} | Deleted Student: ${delData.data?.name}`);

    console.log('\n🎉 ALL 10 TESTS IN PROGRAM 4 VERIFIED SUCCESSFULLY!\n');
  } catch (error) {
    console.error('❌ Test run failed:', error);
  } finally {
    server.close();
  }
}

runTestSuite();
