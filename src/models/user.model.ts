// models/user.model.ts
import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';
import RoleModel from './role.model';

class UserModel extends Model { }

UserModel.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      notEmpty: true,
      isEmail: true,
      len: [1, 45],
      isValidEmail(value: string) {
        if (!/\S+@\S+\.\S+/.test(value)) {
          throw new Error('Email should be a valid email address');
        }
      }
    },
  },
  displayName: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
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
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      notEmpty: true,
      isAlphanumeric: true,
    }
  },
}, {
  sequelize,
  modelName: 'User',
  tableName: 'user',
  timestamps: false // Disable createdAt and updatedAt fields
});

// Define associations
UserModel.belongsToMany(RoleModel, { through: 'privileges', timestamps: false, foreignKey: 'userId' });
RoleModel.belongsToMany(UserModel, { through: 'privileges', timestamps: false, foreignKey: 'roleId' });

// NOTE: Avoid placing business logic directly in the model.
// Business logic, such as password hashing, should be handled in the service.
// Keep the model focused on data structure and relationships.
// For more details, refer to user.service.ts.

// Hash the password before saving the user
// UserModel.beforeCreate(async (user: any) => {
//   user.password = await hashPassword(user.password);
// });

export default UserModel;
