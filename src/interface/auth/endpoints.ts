import { commonApi } from '../../api';

const verify = async (message: string, signature: string) => {
  const resp: { success: boolean } = await commonApi.post('/verify', { message, signature })
  if (resp.success) {
    localStorage.setItem('cobo-siwe-message', message);
    localStorage.setItem('cobo-siwe-signature', signature);
  }
}

interface Test {
  success: boolean
}

const testApi = async () => {
  const resp: Test = await commonApi.get('/test');
  alert(resp.success);
}

export {
  verify,
  testApi,
}