// models/user.model.ts
import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';
import RoleModel from './role.model';

export interface User {
  id: number;
  username: string;
  password: string;
  displayName: string;
  emails: { value: string }[];
}

class UserModel extends Model { }

UserModel.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      notEmpty: true,
      isAlphanumeric: true,
    }
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
      len: [6, 100],
    }
  },
  displayName: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
    }
  },
  emails: {
    type: DataTypes.JSON,
    allowNull: false,
    validate: {
      notEmpty: true,
      isEmailArray(value: any) {
        if (!Array.isArray(value) || value.some(email => !/\S+@\S+\.\S+/.test(email.value))) {
          throw new Error('Emails should be an array of valid email addresses');
        }
      }
    }
  },
}, {
  sequelize,
  modelName: 'User',
  tableName: 'user'
});

// Define associations
UserModel.belongsToMany(RoleModel, { through: 'privileges', foreignKey: 'userId' });
RoleModel.belongsToMany(UserModel, { through: 'privileges', foreignKey: 'roleId' });

// NOTE: Avoid placing business logic directly in the model.
// Business logic, such as password hashing, should be handled in the service.
// Keep the model focused on data structure and relationships.
// For more details, refer to user.service.ts.

// Hash the password before saving the user
// UserModel.beforeCreate(async (user: any) => {
//   user.password = await hashPassword(user.password);
// });

export default UserModel;
