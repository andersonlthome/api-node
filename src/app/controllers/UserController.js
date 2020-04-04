import * as Yup from 'yup';

import { cpf as cpfValidator } from 'cpf-cnpj-validator';

import User from '../models/User';
import File from '../models/File';

import ClientAsaas from '../asaas/Clients';

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

    await user.update(req.body);

    const { id, name, avatar, phone, cpf } = await User.findByPk(req.userId, {
      include: [
        {
          model: File,
          as: 'avatar',
          attributes: ['id', 'path', 'url'],
        },
      ],
    });

    return res.json({
      id,
      name,
      email,
      avatar,
      phone,
      cpf,
    });
  }
}

export default new UserController();
