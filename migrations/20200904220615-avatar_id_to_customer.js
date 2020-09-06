'use strict';


module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('customers', 'avatar_id', {
      type: Sequelize.INTEGER,
      references: { model: 'files', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
      allowNull: true,

    });

  },

  down: queryInterface => {
    return queryInterface.removeColumn('customers', 'avatar_id');

  }
};
