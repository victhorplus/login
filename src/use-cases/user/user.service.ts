import { PrismaClient } from "@prisma/client";
import { IUserRequest } from "../../interfaces";
import { hash, compare } from "bcryptjs";
import { sign } from "jsonwebtoken";
import 'dotenv/config';

export class UserService {
    client: PrismaClient;
    
    constructor() {
        this.client = new PrismaClient();
    }

    async getUsers(): Promise<IUserRequest[]> {
        return this.client.user.findMany();
    }

    async create({ name, username, password }: IUserRequest): Promise<IUserRequest> {
        const userAlreadyExist$ = await this.client.user.findFirst({
            where: { username }
        });

        if(userAlreadyExist$){
            throw { statusCode: 401, message: "User already exists!" };
        }

        const user$ = await this.client.user.create({
            data: {
                name,
                username,
                password: await hash(password, 8),
            }
        });
        delete user$.password;

        return user$;
    }

    async authenticateUser({ username, password }: IUserRequest): Promise<{ token: string }> {
        const userMatch$ = await this.client.user.findFirst({
            where: { username }
        });
        
        if(!userMatch$){
            throw { statusCode: 401, message: "Username not found" }
        }
        
        const passwordMatch = await compare(password, userMatch$.password);
        if(passwordMatch){
            const token = sign(
                {},
                process.env.TOKEN_SECRET,
                {
                    subject: userMatch$.id,
                    expiresIn: "200s"
                }
            )
            return { token };
        }

        throw { statusCode: 401, message: "Incorrect password"};
    }

    async deleteUser({ id }: IUserRequest): Promise<IUserRequest> {
        const userMatch$ = await this.client.user.findFirst({where: { id }});
        if(!userMatch$){
            throw { statusCode: 401, message: "User not found"};
        }
        
        const deleteUser$ = await this.client.user.delete({
            where: { id }
        });
        
        return deleteUser$;
    }
}