module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('users', 'secret_token', {
      type: Sequelize.STRING,
      onDelete: 'SET NULL',
      allowNull: true,
    });
  },

  down: queryInterface => {
    return queryInterface.removeColumn('users', 'secret_token');
  },
};
