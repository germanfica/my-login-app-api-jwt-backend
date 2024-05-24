// users.ts
import bcrypt from 'bcrypt';
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
});

// Define associations
UserModel.belongsToMany(RoleModel, { through: 'UserRoles', foreignKey: 'userId' });
RoleModel.belongsToMany(UserModel, { through: 'UserRoles', foreignKey: 'roleId' });

// Hash the password before saving the user
UserModel.beforeCreate(async (user: any) => {
  user.password = await bcrypt.hash(user.password, 10);
});

export default UserModel;
