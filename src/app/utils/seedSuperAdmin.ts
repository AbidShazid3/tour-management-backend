/* eslint-disable no-console */
import { envVars } from "../config/evn";
import { IAuthProvider, IProvider, IUser, Role } from "../modules/user/user.interface";
import { User } from "../modules/user/user.model";
import bcryptjs from 'bcryptjs'

export const seedSuperAdmin = async () => {
    try {
        const isExistSuperAdmin = await User.findOne({ email: envVars.SUPER_ADMIN_EMAIL })
        if (isExistSuperAdmin) {
            console.log("Super admin exist");
            return;
        }
        console.log('trying to create super admin');

        const hashedPassword = await bcryptjs.hash(envVars.SUPER_ADMIN_PASSWORD, Number(envVars.BCRYPT_SALT_ROUND));

        const authProvider: IAuthProvider = {
            provider: IProvider.CREDENTIALS,
            providerId: envVars.SUPER_ADMIN_EMAIL
        }

        const payload: IUser = {
            name: 'super admin',
            role: Role.SUPER_ADMIN,
            email: envVars.SUPER_ADMIN_EMAIL,
            password: hashedPassword,
            isVerified: true,
            auths: [authProvider]
        }

        const superAdmin = await User.create(payload)
        console.log('super admin created');
        console.log(superAdmin);

    } catch (error) {
        console.log(error);
    }
}