import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate, Trend } from 'k6/metrics';

// Custom metrics for high-precision telemetry
export const errorRate = new Rate('errors');
export const dashboardLatency = new Trend('dashboard_latency');

export const options = {
  stages: [
    { duration: '5s', target: 1000 },    // Fast ramp to 1k users
    { duration: '10s', target: 5000 },   // Surge to 5k users
    { duration: '15s', target: 10000 },  // Peak Spike: 10,000 concurrent users!
    { duration: '15s', target: 10000 },  // Sustained 10,000 concurrent users blast
    { duration: '5s', target: 0 },       // Ramp down
  ],
  thresholds: {
    http_req_failed: ['rate<0.05'],      // Error rate under 5%
    http_req_duration: ['p(95)<3000'],   // 95% requests < 3s
  },
  gracefulStop: '3s',
  discardResponseBodies: true,
};

const BASE_URL = 'https://demetia.vercel.app';

export default function () {
  const params = {
    headers: {
      'User-Agent': 'k6-load-test-agent/1.0 (Mobile; iPhone 15 Pro; iOS 17)',
      'Accept': 'text/html,application/xhtml+xml',
    },
    timeout: '10s',
  };

  // Test 1: Hit the landing page
  const homeRes = http.get(`${BASE_URL}/`, {
    ...params,
    tags: { name: 'HomePage' },
  });

  const homeSuccess = check(homeRes, {
    'Home status is 200': (r) => r.status === 200,
  });
  errorRate.add(!homeSuccess);

  // Test 2: Hit the core User Dashboard
  const dashStart = Date.now();
  const userRes = http.get(`${BASE_URL}/user`, {
    ...params,
    tags: { name: 'UserDashboard' },
  });
  dashboardLatency.add(Date.now() - dashStart);

  const userSuccess = check(userRes, {
    'User Dashboard status is 200': (r) => r.status === 200,
  });
  errorRate.add(!userSuccess);

  sleep(0.3);
}

