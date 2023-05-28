import http from 'k6/http';
import k6 from 'k6';

const { SERVICE_HOST, SERVICE_PORT, NODE_ENV } = __ENV;

if (!/^local$|^k6$/.test(NODE_ENV)) {
    throw "K6 test must in LOCAL or K6 .env";
}

export const randomString = (min  = 0, max  = 0) => {
    const totalCount = (Math.random() % (max - min + 1)) + min || 0;
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let counter = 0;
    let result = '';
    while (counter < totalCount) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
      counter += 1;
    }
    return result;
};

export const randomInteger = (min = 0, max  = 0) => {
    return (Math.random() % (max - min + 1)) + min;
};

export const randomBoolean = () => {
    return Math.random() % 2 > 0;
};

export const randomIntegerArray = (length, option = {}) => {
    const { min, max } = option;
    const result = [];
    for (let i = 0; i < length; i++) {
        result.push(randomInteger(min, max));
    }
    return result;
};

export const randomStringArray = (length, option = {}) => {
    const { min, max } = option;
    const result = [];
    for (let i = 0; i < length; i++) {
        result.push(randomString(min, max));
    }
    return result;
};

export const randomBooleanArray = (length) => {
    const result = [];
    for (let i = 0; i < length; i++) {
        result.push(randomBoolean());
    }
    return result;
};

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
              exec: 'getAccount',
              vus: 1500,
              duration: '30s',
              env: { SERVICE_HOST, SERVICE_PORT },
          },
          createAccount: {
              executor: 'constant-vus',
              exec: 'createAccount',
              vus: 15,
              duration: '30s',
              env: { SERVICE_HOST, SERVICE_PORT },
          },
          updateAccount: {
              executor: 'constant-vus',
              exec: 'updateAccount',
              vus: 1500,
              duration: '30s',
              env: { SERVICE_HOST, SERVICE_PORT },
          },
          deleteAccount: {
              executor: 'constant-vus',
              exec: 'updateAccount',
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
      const res = http.get(`http://${SERVICE_HOST}:${SERVICE_PORT}/v1/accounts?id=${randomInteger(1,100000)}`); 
      console.log(res);
      console.log('getAccount Response time was ' + String(res.timings.duration) + ' ms');
      k6.check(res, { 'getAccount status was 404': (r) => r.status == 404 });
      k6.sleep(1);
  };
  
  export const createAccount = () => {
      const res = http.post(
          `http://${SERVICE_HOST}:${SERVICE_PORT}/v1/accounts`,
          JSON.stringify({
              name: 'josh',
              email: 'example@mail.com',
              gender: 'MALE',
              language: 'Japanese',
              area: 'Asia',
              country: 'Japan',
              roles: [1,2,3],
              status: 1,
          }),
          {
              headers: { 'Content-Type': 'application/json' }
          }
      );  
      console.log(res);
      console.log('createAccount Response time was ' + String(res.timings.duration) + ' ms');
      k6.check(res, { 'createAccount status was 200': (r) => r.status == 200 });
      k6.sleep(1);
  };
  
  export const updateAccount = () => {
      const res = http.put(
          `http://${SERVICE_HOST}:${SERVICE_PORT}/v1/accounts/${randomInteger(1,100000)}`,
          JSON.stringify({
              name: 'josh',
              email: 'example@mail.com',
              gender: 'MALE',
              language: 'Japanese',
              area: 'Asia',
              country: 'Japan',
              roles: [1,2,3],
              status: 1,
          }),
          {
              headers: { 'Content-Type': 'application/json' }
          }
      );  
      console.log(res);
      console.log('updateAccount Response time was ' + String(res.timings.duration) + ' ms');
      k6.check(res, { 'updateAccount status was 200': (r) => r.status == 200 });
      k6.sleep(1);
  };
  
  export const deleteAccount = () => {
      const res = http.del(`http://${SERVICE_HOST}:${SERVICE_PORT}/v1/accounts/${randomInteger(1,100000)}`);  
      console.log(res);
      console.log('deleteAccount Response time was ' + String(res.timings.duration) + ' ms');
      k6.check(res, { 'deleteAccount status was 200': (r) => r.status == 200 });
      k6.sleep(1);
  };
  