/* eslint-disable prettier/prettier */
import axios from 'axios';
import asaasConfig from '../../config/asaas';
import User from '../models/User';

function dateFormated(dateI) {
  const date = new Date(dateI);
  console.log(date);
  const dia = date.getDate().toString();
  const diaF = (dia.length == 1) ? '0' + dia : dia;
  const mes = (date.getMonth() + 1).toString(); //+1 pois no getMonth Janeiro começa com zero.
  const mesF = (mes.length == 1) ? '0' + mes : mes;
  const anoF = date.getFullYear();
  const dateF = anoF + "/" + mesF + "/" + diaF;
  // const nextDueDate = dateFormated(signature.nextDueDate);
  // } catch (error) {
  console.log(dateF);
  return dateF;
}
class Signature {


  async newSignature(req, res) {
    // billingType BOLETO and UNDEFINED, need cpfCnpj, CREDIT_CARD don't need, "nextDueDate": "2020-05-17"
    // body: "{  \"customer\": \"{CUSTOMER_ID}\",  \"billingType\": \"BOLETO\",  \"nextDueDate\": \"2017-05-15\",  \"value\": 19.9,  \"cycle\": \"MONTHLY\",  \"description\": \"Assinatura Plano Pró\",  \"discount\": {    \"value\": 10,    \"dueDateLimitDays\": 0  },  \"fine\": {    \"value\": 1  },  \"interest\": {    \"value\": 2  }}"
    // console.log(req.body);
    console.log(req.userId);
    const signature = req.body;
    console.log(signature);

    const { id_asaas } = await User.findByPk(req.userId);
    const user = await User.findByPk(req.userId);
console.log(123, user);


    const nextDueDate = dateFormated(signature.nextDueDate);

    console.log(nextDueDate);
    // TODO: buscar do SignatureType
    const valuePlan = 0;
    if (signature.cycle === 'WEEKLY') {// 3 fator semana com mais ganho
      valuePlan = monthlyValue / 3 * signature.numberOfAccounts;
    }
    if (signature.cycle === 'MONTHLY') {
      valuePlan = monthlyValue * numberOfAccounts;
    }
    // TODO:

    const body = `{
         "customer": "${id_asaas}",
         "billingType": "${signature.billingType}",
         "nextDueDate": "${nextDueDate}",
         "value": ${signature.value},
         "cycle": ${signature.cycle},
         "description": "${signature.description}",
    }`;
    console.log(body);
    res = body;
    // const res = {};
    // const res = await axios.post('https://www.asaas.com/api/v3/subscriptions', 'body',
    //   {
    //     headers: {
    //       'Content-Type': asaasConfig.contentType,
    //       'access_token': asaasConfig.accessToken,
    //     },
    //   }
    // );
    console.log(res);
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
