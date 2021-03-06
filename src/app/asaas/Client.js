/* eslint-disable prettier/prettier */
import axios from 'axios';
import asaasConfig from '../../config/asaas';

class Client {
  async createClient(name, email, mobilePhone, cpfCnpj) {
    const res = await axios.post('https://www.asaas.com/api/v3/customers',
    `{ "name": ${name},  "email": ${email},  "mobilePhone": ${null},  "cpfCnpj":${null} }`,
     {
        headers: {
          'Content-Type': asaasConfig.contentType,
          'access_token': asaasConfig.accessToken,
        },
      }
    ).catch(err => {console.log('Asaas Error: ', err)});
    return res;
  }

  async updateClient(name, email, mobilePhone, cpfCnpj, id_asaas) {
    const res = await axios.post(`https://www.asaas.com/api/v3/customers/${id_asaas}`,
    `{ "name": "${name}",  "email": "${email}",  "mobilePhone": "${mobilePhone}",  "cpfCnpj":"${cpfCnpj}" }`,
     {
        headers: {
          'Content-Type': asaasConfig.contentType,
          'access_token': asaasConfig.accessToken,
        },
      }
    ).catch(err => {console.log('Asaas Error: ', err)});
    return res;
  }
}

export default new Client();
