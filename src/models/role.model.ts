// models/role.model.ts
import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';
import { ERole } from '../enums/role.enum';

class RoleModel extends Model {
  declare id: number; // this is ok! The 'declare' keyword ensures this field will not be emitted by TypeScript.
  declare name: string;
}

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
