'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Users', 'resetPasswordToken', { type: Sequelize.STRING });
    await queryInterface.addColumn('Users', 'resetPasswordExpires', { type: Sequelize.DATE });
  },
  down: async (queryInterface) => {
    await queryInterface.removeColumn('Users', 'resetPasswordToken');
    await queryInterface.removeColumn('Users', 'resetPasswordExpires');
  }
};
