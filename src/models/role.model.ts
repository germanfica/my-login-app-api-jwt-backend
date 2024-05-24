// models/Role.ts
import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';

export enum ERole {
  ROLE_USER = 'ROLE_USER',
  ROLE_ADMIN = 'ROLE_ADMIN',
}

export interface Role {
  id: number;
  name: ERole;
}

class RoleModel extends Model { }

RoleModel.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.ENUM,
    values: Object.values(ERole),
    allowNull: false,
  },
}, {
  sequelize,
  modelName: 'Role',
  tableName: 'role',
  timestamps: false // Disable createdAt and updatedAt fields
});

export default RoleModel;
