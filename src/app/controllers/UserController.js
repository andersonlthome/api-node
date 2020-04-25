import * as Yup from 'yup';
import moment from 'moment';

import { cpf as cpfValidator } from 'cpf-cnpj-validator';

import User from '../models/User';
import File from '../models/File';

import ClientAsaas from '../asaas/Client';

const phoneRegExp = /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;

class UserController {
  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string()
        .email()
        .required(),
      phone: Yup.string().matches(phoneRegExp, 'Phone number is not valid'),
      cpf: Yup.number(),
      password: Yup.string()
        .required()
        .min(6),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const userExists = await User.findOne({ where: { email: req.body.email } });

    if (userExists) {
      return res.status(400).json({ error: 'User already exists' });
    }

    const asaas = await ClientAsaas.createClient(
      req.body.name,
      req.body.email,
      req.body.phone,
      req.body.cpf
    );

    req.body.id_asaas = asaas.data.id;

    const {
      id,
      name,
      email,
      provider,
      phone,
      cpf,
      id_asaas,
    } = await User.create(req.body);

    return res.json({
      id,
      name,
      email,
      provider,
      phone,
      cpf,
      id_asaas,
    });
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string(),
      email: Yup.string().email(),
      phone: Yup.string().matches(phoneRegExp, 'Phone number is not valid'),
      cpf: Yup.string(),
      oldPassword: Yup.string().min(6),
      password: Yup.string()
        .min(6)
        .when('oldPassword', (oldPassword, field) =>
          oldPassword ? field.required() : field
        ),
      confirmPassword: Yup.string().when('password', (password, field) =>
        password ? field.required().oneOf([Yup.ref('password')]) : field
      ),
    });

    if (!cpfValidator.isValid(req.body.cpf)) {
      return res.status(400).json({ error: 'Cpf Invalid' });
    }

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const { email, oldPassword } = req.body;

    const user = await User.findByPk(req.userId);

    if (email !== user.email) {
      const userExists = await User.findOne({ where: { email } });

      if (userExists) {
        return res.status(400).json({ error: 'User already exists' });
      }
    }

    if (oldPassword && !(await user.checkPassword(oldPassword))) {
      return res.status(401).json({ error: 'Password does not match' });
    }
    console.log(req.body);
    await user.update(req.body);

    const { id, name, avatar, phone, cpf, id_asaas } = await User.findByPk(
      req.userId,
      {
        include: [
          {
            model: File,
            as: 'avatar',
            attributes: ['id', 'path', 'url'],
          },
        ],
      }
    );

    await ClientAsaas.updateClient(name, email, phone, cpf, id_asaas);

    return res.json({
      id,
      name,
      email,
      avatar,
      phone,
      cpf,
      id_asaas,
    });
  }

  async getUser(req, res) {
    const user = await User.findByPk(req.userId);
    return res.json({ user });
  }
  
  async updateStatus(req, res) {
    // getStatusCobrança atual 
    // if 
    // console.log(req.body);
    const user = await User.findByPk(req.body.id);
    // const data = user.dataValues;
    // const createdAt = data.createdAt;
    // const today = new Date();
    // const now = moment(today);
    // let duration = moment.duration(now.diff(moment(createdAt)));

    // if (duration.asDays() < 3) {
    //   user.status = 'TRYING';
    // }
    // if ((duration.asDays() > 3) && (user.status !== 'ACTIVE')) {
    //   user.status = 'TRYED'; 
    // }
    // await user.update(data);
    
    return res.json({ user });
  }

}

export default new UserController();

// export enum ClientType {
//   backend = 1,
//   auth = 0
// }