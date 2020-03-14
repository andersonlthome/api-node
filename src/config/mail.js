export default {
  host: process.env.MAIL_HOST,
  port: process.env.MAIL_PORT,
  secure: false,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
  default: {
    from: 'Equipe GoBarber <noreply@gobarber.com>',
  },
};

/*
Serviços smtp para envio de emails

Amazon SES
Mailgun
Sparkpost
Mandril (Mailchimp)
Gmail (tem limite baixo)

Mailtrap (DEV)

*/
