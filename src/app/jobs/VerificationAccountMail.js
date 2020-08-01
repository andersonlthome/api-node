import { format, parseISO } from 'date-fns';
import pt from 'date-fns/locale/pt';
import Mail from '../../lib/Mail';

class VerificationAccountMail {
  get key() {
    return 'VerificationAccountMail';
  }

  async handle({ data }) {
    const { name, email, secret_token } = data;
    console.log(123, data);

    await Mail.sendMail({
      to: `${name} <${email}>`,
      subject: 'Verificação de email (Engajei)',
      template: 'verificationAccount',
      context: {
        user: name,
        codigo: secret_token,
      },
    }).then(() => { console.log('email enviado') }).catch(err => console.log('erro de envio: ', err));
  }
}

export default new VerificationAccountMail();
