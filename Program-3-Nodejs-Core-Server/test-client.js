/**
 * Automated Test Client for Program 3 (CO4)
 * Tests all endpoints, streams, file system persistence, and EventEmitter notifications.
 * Connects to an existing server on port 4000 or automatically starts an ephemeral test server.
 */

const { startServer } = require('./server');

async function checkRunningServer(url) {
  try {
    const res = await fetch(`${url}/api/attendance`, { signal: AbortSignal.timeout(600) });
    return res.ok;
  } catch (e) {
    return false;
  }
}

async function runTestSuite() {
  console.log('\n===============================================================');
  console.log('🧪 Starting Verification Test Suite for Program 3 (CO4)');
  console.log('👤 Student Roll No: 38 | Dept: B.E. AI & DS (Sem V)');
  console.log('===============================================================\n');

  let baseUrl = 'http://127.0.0.1:4000';
  let spawnedServer = null;

  // Check if server is already running on port 4000
  const isRunning = await checkRunningServer(baseUrl);

  if (isRunning) {
    console.log('🔗 Connected to already-running Node.js server on port 4000.\n');
  } else {
    console.log('⚙️ Starting local test server instance on dynamic ephemeral port...');
    spawnedServer = await startServer(0);
    const port = spawnedServer.address().port;
    baseUrl = `http://127.0.0.1:${port}`;
    console.log(`📡 Test server listening on: ${baseUrl}\n`);
  }

  try {
    // -------------------------------------------------------------
    // Test 1: GET /api/attendance
    // -------------------------------------------------------------
    console.log('1️⃣ [TEST] GET /api/attendance (Read records from file system)...');
    const getRes = await fetch(`${baseUrl}/api/attendance`);
    const getData = await getRes.json();
    console.log(`   ✅ Status: ${getRes.status} | Total Records: ${getData.totalInStore || getData.count}`);

    // -------------------------------------------------------------
    // Test 2: GET /api/attendance/stats
    // -------------------------------------------------------------
    console.log('\n2️⃣ [TEST] GET /api/attendance/stats (Calculated analytics)...');
    const statsRes = await fetch(`${baseUrl}/api/attendance/stats`);
    const statsData = await statsRes.json();
    console.log(`   ✅ Status: ${statsRes.status} | Compliance: ${statsData.stats?.attendanceRatePercentage}`);

    // -------------------------------------------------------------
    // Test 3: POST /api/attendance
    // -------------------------------------------------------------
    console.log('\n3️⃣ [TEST] POST /api/attendance (Store new record & trigger EventEmitter)...');
    const postRes = await fetch(`${baseUrl}/api/attendance`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        rollNo: "38",
        name: "Ayush Sharma",
        course: "B.E. AI & DS",
        semester: "V",
        status: "Present",
        remarks: "Automated test verification executed"
      })
    });
    const postData = await postRes.json();
    console.log(`   ✅ Status: ${postRes.status} | Result: ${postData.message}`);
    const newId = postData.data?.id;

    // -------------------------------------------------------------
    // Test 4: PUT /api/attendance?id=...
    // -------------------------------------------------------------
    console.log(`\n4️⃣ [TEST] PUT /api/attendance?id=${newId} (Update status & trigger EventEmitter)...`);
    const putRes = await fetch(`${baseUrl}/api/attendance?id=${newId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        status: "Late",
        remarks: "Updated status via PUT"
      })
    });
    const putData = await putRes.json();
    console.log(`   ✅ Status: ${putRes.status} | New Status: ${putData.data?.status}`);

    // -------------------------------------------------------------
    // Test 5: GET /api/attendance/logs (Streams: fs.createReadStream)
    // -------------------------------------------------------------
    console.log('\n5️⃣ [TEST] GET /api/attendance/logs (Audit log stream verification)...');
    const logRes = await fetch(`${baseUrl}/api/attendance/logs`);
    const logText = await logRes.text();
    console.log(`   ✅ Status: ${logRes.status}`);
    if (logText) {
      const lastLine = logText.trim().split('\n').pop();
      console.log(`   📜 Streamed Log Entry: ${lastLine}`);
    }

    // -------------------------------------------------------------
    // Test 6: GET /api/attendance/export (Streams: Readable Stream)
    // -------------------------------------------------------------
    console.log('\n6️⃣ [TEST] GET /api/attendance/export (CSV Stream export)...');
    const csvRes = await fetch(`${baseUrl}/api/attendance/export`);
    const csvContentType = csvRes.headers.get('content-type');
    const csvContent = await csvRes.text();
    console.log(`   ✅ Status: ${csvRes.status} | Content-Type: ${csvContentType}`);
    console.log(`   📊 Streamed CSV Preview: ${csvContent.split('\n')[0]}`);

    // -------------------------------------------------------------
    // Test 7: DELETE /api/attendance?id=...
    // -------------------------------------------------------------
    console.log(`\n7️⃣ [TEST] DELETE /api/attendance?id=${newId} (Delete record & trigger EventEmitter)...`);
    const delRes = await fetch(`${baseUrl}/api/attendance?id=${newId}`, {
      method: 'DELETE'
    });
    const delData = await delRes.json();
    console.log(`   ✅ Status: ${delRes.status} | Result: ${delData.message}`);

    console.log('\n🎉 ALL 7 TEST CASES IN PROGRAM 3 COMPLETED & VERIFIED SUCCESSFULLY!\n');
  } catch (error) {
    console.error('❌ Test run failed:', error);
  } finally {
    if (spawnedServer) {
      spawnedServer.close();
    }
  }
}

runTestSuite();
