'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    queryInterface.addColumn('Customers', 'avatar_id', {
      type: Sequelize.INTEGER,
      reference: { model: 'files', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
      allowNull: true,

    });

  },

  down: queryInterface => {
    queryInterface.removeColumn('Customers', 'avatar_id');

  }
};
