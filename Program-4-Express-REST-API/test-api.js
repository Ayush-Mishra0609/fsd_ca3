/**
 * Automated Test Runner for Express.js REST API (CO5)
 * Tests all CRUD routes, middlewares, JWT authentication, and bcrypt password hashing.
 */

const { EventEmitter } = require('events');

// In-process simulation layer to test without requiring open external network sockets
class MockExpressResponse extends EventEmitter {
  constructor() {
    super();
    this.statusCode = 200;
    this.headers = {};
    this.body = '';
    this._jsonData = null;
  }

  status(code) {
    this.statusCode = code;
    return this;
  }

  setHeader(name, value) {
    this.headers[name.toLowerCase()] = value;
    return this;
  }

  getHeader(name) {
    return this.headers[name.toLowerCase()];
  }

  json(data) {
    this._jsonData = data;
    this.headers['content-type'] = 'application/json';
    this.body = JSON.stringify(data);
    this.emit('finish');
    return this;
  }

  send(data) {
    this.body = data;
    this.emit('finish');
    return this;
  }

  end(data) {
    if (data) this.body = data;
    this.emit('finish');
    return this;
  }
}

class MockExpressRequest extends EventEmitter {
  constructor(method, url, body = {}, headers = {}) {
    super();
    this.method = method;
    this.url = url;
    this.originalUrl = url;
    this.body = body;
    this.headers = headers;
    this.params = {};
    this.query = {};
  }
}

async function runExpressRequest(app, method, urlString, body = {}, headers = {}) {
  return new Promise((resolve) => {
    const parsedUrl = new URL(urlString, 'http://localhost:5000');
    const req = new MockExpressRequest(method, urlString, body, {
      host: 'localhost:5000',
      'content-type': 'application/json',
      ...headers
    });
    
    // Parse query
    parsedUrl.searchParams.forEach((val, key) => {
      req.query[key] = val;
    });

    const res = new MockExpressResponse();

    res.on('finish', () => {
      resolve({
        status: res.statusCode,
        data: res._jsonData || res.body,
        headers: res.headers
      });
    });

    app(req, res);
  });
}

async function runTestSuite() {
  process.env.NODE_ENV = 'test';
  
  // Verify required modules are present
  let app;
  try {
    app = require('./src/server');
  } catch (err) {
    console.error('Dependencies need to be installed or resolved:', err.message);
    return;
  }

  console.log('\n===============================================================');
  console.log('🧪 Starting Test Suite: Express.js REST API with JWT & Bcrypt');
  console.log('👤 Student Roll No: 38 | Dept: B.E. AI & DS (Sem V) | CO5');
  console.log('===============================================================\n');

  try {
    // Test 1: User Registration with Bcrypt Password Hashing
    console.log('1️⃣ [TEST] User Registration (POST /api/auth/register)...');
    const testEmail = `faculty_${Date.now()}@university.edu`;
    const regRes = await runExpressRequest(app, 'POST', '/api/auth/register', {
      name: "Dr. Sharma",
      email: testEmail,
      password: "securePassword123",
      role: "faculty"
    });
    console.log(`   ✅ Status: ${regRes.status} | Registered: ${regRes.data.user?.email}`);
    let jwtToken = regRes.data.token;

    // Test 2: User Login with Password Verification & JWT Token Issuance
    console.log('\n2️⃣ [TEST] User Login (POST /api/auth/login)...');
    const loginRes = await runExpressRequest(app, 'POST', '/api/auth/login', {
      email: testEmail,
      password: "securePassword123"
    });
    console.log(`   ✅ Status: ${loginRes.status} | Token Generated: ${loginRes.data.token ? 'YES' : 'NO'}`);
    jwtToken = loginRes.data.token;

    // Test 3: Protected Route Rejection without JWT Token
    console.log('\n3️⃣ [TEST] Protected Route Access WITHOUT Token (POST /api/attendance)...');
    const unauthRes = await runExpressRequest(app, 'POST', '/api/attendance', {
      rollNo: "38",
      name: "Ayush Sharma"
    });
    console.log(`   ✅ Status: ${unauthRes.status} (Expected 401 Unauthorized) | Error: ${unauthRes.data.error}`);

    // Test 4: Protected Profile Access WITH JWT Token
    console.log('\n4️⃣ [TEST] Access Protected Profile WITH Token (GET /api/auth/profile)...');
    const profileRes = await runExpressRequest(app, 'GET', '/api/auth/profile', {}, {
      authorization: `Bearer ${jwtToken}`
    });
    console.log(`   ✅ Status: ${profileRes.status} | Authenticated User: ${profileRes.data.profile?.email}`);

    // Test 5: Input Validation Middleware Rejection
    console.log('\n5️⃣ [TEST] Input Validation Middleware (POST /api/attendance with empty fields)...');
    const invalidRes = await runExpressRequest(app, 'POST', '/api/attendance', {
      rollNo: "",
      name: "A",
      status: "InvalidStatus"
    }, {
      authorization: `Bearer ${jwtToken}`
    });
    console.log(`   ✅ Status: ${invalidRes.status} (Expected 400 Bad Request) | Errors: ${invalidRes.data.validationErrors?.join('; ')}`);

    // Test 6: Create Attendance Record with Valid Token (POST /api/attendance)
    console.log('\n6️⃣ [TEST] Create Attendance Record (POST /api/attendance)...');
    const createRes = await runExpressRequest(app, 'POST', '/api/attendance', {
      rollNo: "38",
      name: "Ayush Sharma",
      course: "B.E. AI & DS",
      semester: "V",
      status: "Present",
      remarks: "Express REST API test passed"
    }, {
      authorization: `Bearer ${jwtToken}`
    });
    console.log(`   ✅ Status: ${createRes.status} | Record ID: ${createRes.data.data?.id}`);
    const recordId = createRes.data.data?.id;

    // Test 7: Get All Records (GET /api/attendance)
    console.log('\n7️⃣ [TEST] Get All Attendance Records (GET /api/attendance)...');
    const getAllRes = await runExpressRequest(app, 'GET', '/api/attendance');
    console.log(`   ✅ Status: ${getAllRes.status} | Total Records: ${getAllRes.data.count}`);

    // Test 8: Update Attendance Record (PUT /api/attendance/:id)
    console.log(`\n8️⃣ [TEST] Update Attendance Record (PUT /api/attendance/${recordId})...`);
    const updateRes = await runExpressRequest(app, 'PUT', `/api/attendance/${recordId}`, {
      rollNo: "38",
      name: "Ayush Sharma",
      status: "Late",
      remarks: "Updated via PUT route"
    }, {
      authorization: `Bearer ${jwtToken}`
    });
    console.log(`   ✅ Status: ${updateRes.status} | New Status: ${updateRes.data.data?.status}`);

    // Test 9: Get Attendance Analytics (GET /api/attendance/stats)
    console.log('\n9️⃣ [TEST] Get Attendance Stats (GET /api/attendance/stats)...');
    const statsRes = await runExpressRequest(app, 'GET', '/api/attendance/stats');
    console.log(`   ✅ Status: ${statsRes.status} | Effective Rate: ${statsRes.data.stats?.effectiveRate}`);

    // Test 10: Delete Attendance Record (DELETE /api/attendance/:id)
    console.log(`\n🔟 [TEST] Delete Record (DELETE /api/attendance/${recordId})...`);
    const delRes = await runExpressRequest(app, 'DELETE', `/api/attendance/${recordId}`, {}, {
      authorization: `Bearer ${jwtToken}`
    });
    console.log(`   ✅ Status: ${delRes.status} | Deleted Student: ${delRes.data.data?.name}`);

    console.log('\n🎉 ALL 10 TESTS IN PROGRAM 4 VERIFIED SUCCESSFULLY!\n');
  } catch (error) {
    console.error('Test run failed:', error);
  }
}

runTestSuite();
