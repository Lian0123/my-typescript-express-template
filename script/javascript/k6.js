import http from 'k6/http';
import k6 from 'k6';

const { SERVICE_HOST, SERVICE_PORT } = __ENV;

export const options = {
  scenarios: {
        getAccounts: {
            executor: 'constant-vus',
            exec: 'getAccounts',
            vus: 1000,
            duration: '30s',
            env: { SERVICE_HOST, SERVICE_PORT },
        },
        getAccount: {
            executor: 'constant-vus',
            exec: 'getAccounts',
            vus: 1500,
            duration: '30s',
            env: { SERVICE_HOST, SERVICE_PORT },
        },
    }
};

export const getAccounts = () => {
    const res = http.get(`http://${SERVICE_HOST}:${SERVICE_PORT}/v1/accounts?limit=10&offset=0`); 
    console.log(res);
    console.log('getAccounts Response time was ' + String(res.timings.duration) + ' ms');
    k6.check(res, { 'getAccounts status was 200': (r) => r.status == 200 });
    k6.sleep(1);
};

export const getAccount = () => {
    const res = http.get(`http://${SERVICE_HOST}:${SERVICE_PORT}/v1/account?id=1`); 
    console.log(res);
    console.log('getAccount Response time was ' + String(res.timings.duration) + ' ms');
    k6.check(res, { 'getAccount status was 200': (r) => r.status == 200 });
    k6.sleep(1);
};
