import http from 'http';

const data = JSON.stringify({ credential: 'dev_mock_token' });

const options = {
  hostname: 'localhost',
  port: 5000,
  path: '/api/auth/google',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length
  }
};

const req = http.request(options, res => {
  let responseData = '';
  res.on('data', chunk => responseData += chunk);
  res.on('end', () => console.log('Response:', responseData));
});

req.on('error', error => console.error(error));
req.write(data);
req.end();
