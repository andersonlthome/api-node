import * as Yup from 'yup';
import moment from 'moment';
import { cpf as cpfValidator } from 'cpf-cnpj-validator';
import randomstring from 'randomstring';
import User from '../models/User';
import File from '../models/File';
import ClientAsaas from '../asaas/Client';
import VerificationAccountMail from '../jobs/VerificationAccountMail';
import Queue from '../../lib/Queue';

const phoneRegExp = /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;
// enum
const ClientStatus = Object.freeze({
  TRYING: 'TRYING',
  TRYED: 'TRYED',
  ACTIVE: 'ACTIVE',
  PENDING: 'PENDING',
  INACTIVE: 'INACTIVE',
});

class UserController {
  async store(req, res) {
    try {
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

      const secretToken = randomstring.generate(7);
      req.body.secret_token = secretToken;
      req.body.status = ClientStatus.INACTIVE;

      const {
        id,
        name,
        email,
        admin,
        phone,
        cpf,
        id_asaas,
        secret_token,
        status
      } = await User.create(req.body);

      await Queue.add(VerificationAccountMail.key, {
        name, email, secret_token
      });

      // id,
      //   name,
      //   email,
      //   provider,
      //   phone,
      //   cpf,
      //   id_asaas,
      return res.json({
        id,
        status
      });

    } catch (error) {
      console.log('Error: ', error);
      return res.json({ error: 'erro ao criar usuario' })
    }
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

    if (!cpfValidator.isValid(req.body.cpf) && req.body.cpf!=undefined) {
      return res.status(400).json({ error: 'Cpf Invalid' });
    }

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const { email, oldPassword } = req.body;

    const user = await User.findByPk(req.userId);
    // console.log(req.body);
    // console.log(user);
    if (email !== user.dataValues.email && email != undefined) {
      const userExists = await User.findOne({ where: { email } });

      if (userExists) {
        return res.status(400).json({ error: 'User already exists' });
      }
    }

    if (oldPassword && !(await user.checkPassword(oldPassword))) {
      return res.status(401).json({ error: 'Password does not match' });
    }
    // console.log('update', req.body);
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
 console.log(id, name, avatar, phone, cpf, id_asaas, email);
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

  async verification(req, res) {
    let statusVerification = false;
    try {
      console.log(req.body);
      const user = await User.findByPk(req.body.id);
      // console.log(0,user);
      const dataUser = user.dataValues;
      console.log(1, dataUser);

      if (dataUser.secret_token === req.body.verificationCode) {
        dataUser.status = ClientStatus.TRYING;
        console.log(2, dataUser);
        await User.update({ 'status': dataUser.status }, { where: { 'id': dataUser.id } }, { multi: true });
        statusVerification = true;
      }
      console.log(statusVerification);
      return res.json({ 'statusVerification': statusVerification });
    } catch (error) {
      console.log(1, error);
      return res.json({ 'statusVerification': statusVerification });
    }

  }

  async resendSecretTokenEmail(req, res) {
    // const statusEmail = false;
    console.log(req.body);
    const user = await User.findByPk(req.body.id);
    // console.log(0,user);

    const { name, email, secret_token } = user.dataValues;
    console.log(1, name, email, secret_token);

    try {
      await Queue.add(VerificationAccountMail.key, {
        name, email, secret_token
      });
      let statusEmail = true;
      return res.json({ 'statusEmail': statusEmail });
    } catch (error) {
      let statusEmail = false;
      console.log('error: ' + error);
      return res.json({ 'statusEmail': statusEmail });
    }


  }

  async updateStatus(req, res) {
    // getStatusCobrança atual
    // if
    console.log(req.body);

    const user = await User.findByPk(req.body.id);
    const data = user.dataValues;
    const { createdAt } = data;
    const today = new Date();
    const now = moment(today);
    const duration = moment.duration(now.diff(moment(createdAt)));

    if (duration.asDays() < 3) {
      user.status = ClientStatus.TRYING;
    }
    if (duration.asDays() > 3 && user.status !== 'ACTIVE') {
      user.status = ClientStatus.TRYED;
    }
    await user.update(data);

    return res.json({ user });
  }
}

export default new UserController();
