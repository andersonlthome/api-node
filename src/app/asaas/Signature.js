/* eslint-disable prettier/prettier */
import axios from 'axios';
import asaasConfig from '../../config/asaas';

class Signature {
  async createSignature(req, res) {    
    // billingType BOLETO and UNDEFINED, need cpfCnpj, CREDIT_CARD don't need "nextDueDate": "2020-05-17"
    // body: "{  \"customer\": \"{CUSTOMER_ID}\",  \"billingType\": \"BOLETO\",  \"nextDueDate\": \"2017-05-15\",  \"value\": 19.9,  \"cycle\": \"MONTHLY\",  \"description\": \"Assinatura Plano Pró\",  \"discount\": {    \"value\": 10,    \"dueDateLimitDays\": 0  },  \"fine\": {    \"value\": 1  },  \"interest\": {    \"value\": 2  }}"
    console.log(req.body);
    // const user = await User.findByPk(req.userId);

    // const body = `{
    //     "customer": "${user.id_asaas}",
    //     "billingType": "${billingType}",
    //     "nextDueDate": "${req.date}",
    //     "value": 29.90,
    //     "cycle": ${req.cycle},
    //     "description": "${req.typePlan}",
    // }` ;

    // const res = await axios.post('https://www.asaas.com/api/v3/subscriptions', 'body',
    //   {
    //     headers: {
    //       'Content-Type': asaasConfig.contentType,
    //       'access_token': asaasConfig.accessToken,
    //     },
    //   }
    // );
    return res;
  }

  async updateClient(name, email, mobilePhone, cpfCnpj, id_asaas) {
    //   const res = await axios.post(`https://www.asaas.com/api/v3/customers/${id_asaas}`,
    //   `{ "name": "${name}",  "email": "${email}",  "mobilePhone": "${mobilePhone}",  "cpfCnpj":"${cpfCnpj}" }`,
    //    {
    //       headers: {
    //         'Content-Type': asaasConfig.contentType,
    //         'access_token': asaasConfig.accessToken,
    //       },
    //     }
    //   ).catch(err => {console.log(err)});
    //   return res;
  }
}

export default new Signature();
