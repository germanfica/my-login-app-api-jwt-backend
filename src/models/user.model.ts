// models/user.model.ts
import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';
import RoleModel from './role.model';
import { Role } from '../dtos/role.dto';

// Definir una interfaz para los atributos del modelo
interface UserAttributes {
  id: number;
  email: string;
  displayName: string;
  password: string;
  username: string;
  // Definir una relación opcional con RoleModel
}

// User Associations with alias
interface UserAlias {
  roles?: RoleModel[]; // roles alias
  // getRoles: () => Promise<RoleModel[]>;
  // addRole: (role: RoleModel) => Promise<void>;
  // addRoles: (roles: RoleModel[]) => Promise<void>;
  // setRoles: (roles: RoleModel[]) => Promise<void>;
  // removeRole: (role: RoleModel) => Promise<void>;
  // removeRoles: (roles: RoleModel[]) => Promise<void>;
  // hasRole: (role: RoleModel) => Promise<boolean>;
  // hasRoles: (roles: RoleModel[]) => Promise<boolean>;
  // countRoles: () => Promise<number>;
}

// Definir una interfaz para la creación de atributos
interface UserCreationAttributes extends Optional<UserAttributes, 'id'> { }

class UserModel extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes, UserAlias {
  public id!: number;
  public email!: string;
  public displayName!: string;
  public password!: string;
  public username!: string;

  public roles!: RoleModel[];

  // Métodos opcionales para las relaciones con roles
  // public getRoles!: () => Promise<RoleModel[]>;
  // public addRole!: (role: RoleModel) => Promise<void>;
  // public addRoles!: (roles: RoleModel[]) => Promise<void>;
  // public setRoles!: (roles: RoleModel[]) => Promise<void>;
  // public removeRole!: (role: RoleModel) => Promise<void>;
  // public removeRoles!: (roles: RoleModel[]) => Promise<void>;
}

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
// roles alias
UserModel.belongsToMany(RoleModel, { through: 'privileges', timestamps: false, foreignKey: 'userId', as: 'roles' });
// users alias
RoleModel.belongsToMany(UserModel, { through: 'privileges', timestamps: false, foreignKey: 'roleId', as: 'users' });

// NOTE: Avoid placing business logic directly in the model.
// Business logic, such as password hashing, should be handled in the service.
// Keep the model focused on data structure and relationships.
// For more details, refer to user.service.ts.

// Hash the password before saving the user
// UserModel.beforeCreate(async (user: any) => {
//   user.password = await hashPassword(user.password);
// });

export default UserModel;
