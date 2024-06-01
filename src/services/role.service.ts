// services/user.service.ts
import UserModel from '../models/user.model';
import RoleModel from '../models/role.model';
import { Role } from '../dtos/role.dto';
import { ERole } from '../enums/role.enum';

// somewhere in your code

export async function getUserRoles(userId: number): Promise<ERole[] | null> {
  const user = await UserModel.findByPk(userId, {
    include: [{
      model: RoleModel,
      as: 'roles'
    }]
  });

  if (user) {
    const json = JSON.stringify(user);
    console.log(json);

    // mapeo completo con roles
    // const roles: Role[] = user.roles.map((role: any) => ({
    //   id: role.id,
    //   name: role.name
    // }));

    // solo el nombre del rol
    //const roleNames: string[] = user.roles.map((role: any) => role.name);

    const roleNames: ERole[] = user.roles.map((role: any) => role.name);
    console.log(roleNames);
    console.table(roleNames);
    console.log(JSON.stringify(roleNames));

    return roleNames;
  }

  return null;
}

// export const getUserRoles = async (userId: number): Promise<RoleModel[]> => {
//   try {
//     const user = await UserModel.findByPk(userId, {
//       include: [{
//         model: RoleModel,
//         through: { attributes: [] } // Exclude the join table attributes
//       }]
//     });

//     if (!user) {
//       throw new Error('User not found');
//     }

//     // const awesomeCaptain = await UserModel.findOne({
//     //   where: {
//     //     displayName: 'Jack Sparrow',
//     //   },
//     // });



//     return user.getRoles();
//   } catch (error: any) {
//     throw new Error(`Error fetching roles for user ${userId}: ${error.message}`);
//   }
// }

// export const changeUserRole = async (userId: number, newRoleId: number): Promise<void> => {
//   try {
//     const user = await UserModel.findByPk(userId);

//     if (!user) {
//       throw new Error('User not found');
//     }

//     const role = await RoleModel.findByPk(newRoleId);

//     if (!role) {
//       throw new Error('Role not found');
//     }

//     await user.setRoles([role]);
//   } catch (error: any) {
//     throw new Error(`Error changing role for user ${userId}: ${error.message}`);
//   }
// }
