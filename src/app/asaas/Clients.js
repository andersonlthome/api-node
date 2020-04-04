/* eslint-disable prettier/prettier */
import axios from 'axios';
import asaasConfig from '../../config/asaas';

class Client {
  async createClient(name, email, mobilePhone, cpfCnpj ) {
    const res = await axios.post('https://www.asaas.com/api/v3/customers',
    `{ "name": ${name},  "email": ${email},  "mobilePhone": ${mobilePhone},  "cpfCnpj":${cpfCnpj} }`,
     {
        headers: {
          'Content-Type': asaasConfig.contentType,
          'access_token': asaasConfig.accessToken,
        },
      }
    );
    return res;
  }
}

export default new Client();
