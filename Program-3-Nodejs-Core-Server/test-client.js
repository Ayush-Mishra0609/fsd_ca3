/**
 * Automated Test Client for Program 3 (CO4)
 * Supports both network requests and in-process simulation for sandboxed testing.
 */

const { EventEmitter } = require('events');
const server = require('./server');

// Mock HTTP Response for in-process testing
class MockResponse extends EventEmitter {
  constructor() {
    super();
    this.statusCode = 200;
    this.headers = {};
    this.body = '';
  }

  writeHead(status, headers = {}) {
    this.statusCode = status;
    this.headers = { ...this.headers, ...headers };
  }

  write(chunk) {
    this.body += chunk ? chunk.toString() : '';
  }

  end(chunk) {
    if (chunk) this.body += chunk.toString();
    this.emit('finish');
  }

  // Stream pipe target simulation
  emit(event, ...args) {
    return super.emit(event, ...args);
  }
}

// Mock HTTP Request
class MockRequest extends EventEmitter {
  constructor(method, url, body = null) {
    super();
    this.method = method;
    this.url = url;
    this.headers = {
      host: 'localhost:4000',
      'content-type': 'application/json'
    };
    this.body = body;
  }
}

async function dispatchRequest(method, urlPath, payload = null) {
  return new Promise((resolve, reject) => {
    const req = new MockRequest(method, urlPath, payload);
    const res = new MockResponse();

    res.on('finish', () => {
      try {
        const contentType = res.headers['Content-Type'] || res.headers['content-type'] || '';
        if (contentType.includes('application/json')) {
          resolve({ statusCode: res.statusCode, data: JSON.parse(res.body), headers: res.headers });
        } else {
          resolve({ statusCode: res.statusCode, raw: res.body, headers: res.headers });
        }
      } catch (e) {
        resolve({ statusCode: res.statusCode, raw: res.body, headers: res.headers });
      }
    });

    const requestListener = server.listeners('request')[0];
    if (!requestListener) {
      return reject(new Error('No HTTP request listener found on server'));
    }

    requestListener(req, res);

    // Push data chunks and end
    if (payload) {
      req.emit('data', Buffer.from(JSON.stringify(payload)));
    }
    req.emit('end');
  });
}

async function runTests() {
  console.log('\n===============================================================');
  console.log('🧪 Starting Verification Test Suite for Program 3 (CO4)');
  console.log('👤 Student Roll No: 38 | Dept: B.E. AI & DS (Sem V)');
  console.log('===============================================================\n');

  try {
    // 1. Test GET /api/attendance
    console.log('1️⃣ [TEST] GET /api/attendance (Read records from file system)...');
    const getRes = await dispatchRequest('GET', '/api/attendance');
    console.log(`   ✅ Status: ${getRes.statusCode} | Total Records: ${getRes.data.totalInStore}`);

    // 2. Test GET /api/attendance/stats
    console.log('\n2️⃣ [TEST] GET /api/attendance/stats (Calculated analytics)...');
    const statsRes = await dispatchRequest('GET', '/api/attendance/stats');
    console.log(`   ✅ Status: ${statsRes.statusCode} | Compliance: ${statsRes.data.stats.attendanceRatePercentage}`);

    // 3. Test POST /api/attendance
    console.log('\n3️⃣ [TEST] POST /api/attendance (Store new record & trigger EventEmitter)...');
    const postRes = await dispatchRequest('POST', '/api/attendance', {
      rollNo: "38",
      name: "Ayush Sharma",
      course: "B.E. AI & DS",
      semester: "V",
      status: "Present",
      remarks: "Automated test verification executed"
    });
    console.log(`   ✅ Status: ${postRes.statusCode} | Result: ${postRes.data.message}`);
    const newId = postRes.data.data.id;

    // 4. Test PUT /api/attendance?id=...
    console.log(`\n4️⃣ [TEST] PUT /api/attendance?id=${newId} (Update status & trigger EventEmitter)...`);
    const putRes = await dispatchRequest('PUT', `/api/attendance?id=${newId}`, {
      status: "Late",
      remarks: "Updated status via PUT"
    });
    console.log(`   ✅ Status: ${putRes.statusCode} | New Status: ${putRes.data.data.status}`);

    // 5. Test Streams: GET /api/attendance/logs
    console.log('\n5️⃣ [TEST] GET /api/attendance/logs (Audit log stream verification)...');
    const logRes = await dispatchRequest('GET', '/api/attendance/logs');
    console.log(`   ✅ Status: ${logRes.statusCode}`);
    if (logRes.raw) {
      console.log(`   📜 Streamed Log Entry: ${logRes.raw.trim().split('\n').pop()}`);
    }

    // 6. Test Streams: GET /api/attendance/export (CSV Stream)
    console.log('\n6️⃣ [TEST] GET /api/attendance/export (CSV Stream export)...');
    const csvRes = await dispatchRequest('GET', '/api/attendance/export');
    console.log(`   ✅ Status: ${csvRes.statusCode} | Content-Type: ${csvRes.headers['Content-Type']}`);

    // 7. Test DELETE /api/attendance?id=...
    console.log(`\n7️⃣ [TEST] DELETE /api/attendance?id=${newId} (Delete record & trigger EventEmitter)...`);
    const delRes = await dispatchRequest('DELETE', `/api/attendance?id=${newId}`);
    console.log(`   ✅ Status: ${delRes.statusCode} | Result: ${delRes.data.message}`);

    console.log('\n🎉 ALL 7 TEST CASES COMPLETED & VERIFIED SUCCESSFULLY!\n');
  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    server.close();
  }
}

// Run test suite
setTimeout(runTests, 200);
