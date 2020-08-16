import Sequelize, { Model } from 'sequelize';

class SignatureType extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        cycle: Sequelize.STRING,
        numberOfAccounts: Sequelize.NUMBER,
        value: Sequelize.NUMBER,
        currency: Sequelize.STRING,
        active: Sequelize.BOOLEAN,
        createdAt: Sequelize.DATE,
        updatedAt: Sequelize.DATE,
      },
      { sequelize }
    );
    return this;
  }
}

export default SignatureType;

//TODO: criar migration
