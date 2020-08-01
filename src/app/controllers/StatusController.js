

// import * as Yup from 'yup';

// import { cpf as cpfValidator } from 'cpf-cnpj-validator';

// import User from '../models/User';
// import File from '../models/File';

// import ClientAsaas from '../asaas/Client';

// const phoneRegExp = /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;

// class UserController {
//   async store(req, res) {
//     const schema = Yup.object().shape({
//       name: Yup.string().required(),
//       email: Yup.string()
//         .email()
//         .required(),
//       phone: Yup.string().matches(phoneRegExp, 'Phone number is not valid'),
//       cpf: Yup.number(),
//       password: Yup.string()
//         .required()
//         .min(6),
//     });

//     if (!(await schema.isValid(req.body))) {
//       return res.status(400).json({ error: 'Validation fails' });
//     }

//     const userExists = await User.findOne({ where: { email: req.body.email } });

//     if (userExists) {
//       return res.status(400).json({ error: 'User already exists' });
//     }

//     const asaas = await ClientAsaas.createClient(
//       req.body.name,
//       req.body.email,
//       req.body.phone,
//       req.body.cpf
//     );

//     req.body.id_asaas = asaas.data.id;

//     const {
//       id,
//       name,
//       email,
//       provider,
//       phone,
//       cpf,
//       id_asaas,
//     } = await User.create(req.body);

//     return res.json({
//       id,
//       name,
//       email,
//       provider,
//       phone,
//       cpf,
//       id_asaas,
//     });
//   }