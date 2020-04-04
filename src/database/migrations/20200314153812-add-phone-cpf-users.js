module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn('users', 'phone', {
        type: Sequelize.STRING,
        onDelete: 'SET NULL',
        allowNull: true,
      }),
      queryInterface.addColumn('users', 'cpf', {
        type: Sequelize.STRING,
        onDelete: 'SET NULL',
        allowNull: true,
      }),
    ]);
  },

  down: queryInterface => {
    return Promise.all([
      queryInterface.removeColumn('users', 'phone'),
      queryInterface.removeColumn('users', 'cpf'),
    ]);
  },
};
