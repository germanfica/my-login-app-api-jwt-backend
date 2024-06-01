// middlewares/role.middleware.ts
import { User } from '../dtos/user.dto';
import { ERole } from '../enums/role.enum';
import { getUserRoles } from '../services/role.service';

export const rolesAllowed = (roles: ERole[]) => {
    return async (req: any, res: any, next: any) => {
        const user = req.user as User;

        if (!user) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        //const userRoles = user.roles.map(role => role.name);
        //const _userRoles = await getUserRoles(user.id);
        //const userRoles = _userRoles?.map(role => role.name);
        const userRoles = await getUserRoles(user.id);

        const hasRole = roles.some(role => userRoles?.includes(role));

        console.log(`DO YOU HAVE THE RIGHT? ${hasRole}`)

        if (!hasRole) {
            console.log("YOU DON'T HAVE THE RIGHT...");
            return res.status(403).json({ message: 'Forbidden: You do not have the required permissions' });
        }

        next();
    };
};
