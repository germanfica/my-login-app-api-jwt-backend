// controllers/user.controller.ts
import { Request, Response } from 'express';
import { User } from '../dtos/user.dto';
import { getFirstNameById } from '../services/user.service';
import { getUserRoles } from '../services/role.service';

export const getUserProfile = async (req: Request, res: Response) => {
    const user = req.user as User;
    const userFirstName = await getFirstNameById(user.id);
    const roles = await getUserRoles(user.id);

    //const json = JSON.stringify(user);
    //console.log(json);

    res.json({
        username: user.username,
        email: user.email,
        first_name: userFirstName,
        //roles: roles?.map((role: any) => role.name)
        roles: roles
    });
};
