'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.createTable('appointments',
      {
        id: {
          type: Sequelize.INTEGER,
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,

        },
        customer_id: {
          type: Sequelize.INTEGER,
          references: { model: 'customers', key: 'id' },
          onUpdate: 'CASCADE',
          onDelete: 'SET NULL',
          allowNull: true,
        },
        provider_id: {
          type: Sequelize.INTEGER,
          references: { model: 'customers', key: 'id' },
          onUpdate: 'CASCADE',
          onDelete: 'SET NULL',
          allowNull: true,
        },
        date: {
          type: Sequelize.DATE,
          allowNull: false,
        },
        cancelled_at: {
          type: Sequelize.DATE,
        },
        created_at: {
          type: Sequelize.DATE,
          defaultValue: Sequelize.NOW,
          allowNull: true,
        },
        updated_at: {
          type: Sequelize.DATE,
          defaultValue: Sequelize.NOW,
          allowNull: true,

        }

      });

  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.dropTable('appointments');

  }
};
