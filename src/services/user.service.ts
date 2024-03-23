import { PrismaClient } from "@prisma/client";
import { IUserRequest } from "../interfaces";
import { hash, compare } from "bcryptjs";

export class UserService {
    client: PrismaClient;
    
    constructor() {
        this.client = new PrismaClient();
    }

    async create({ name, username, password }: IUserRequest): Promise<IUserRequest> {
        const userAlreadyExist = await this.client.user.findFirst({
            where: {
                username
            }
        });

        if(userAlreadyExist){
            throw new Error("User already exists!");
        }

        const user = await this.client.user.create({
            data: {
                name,
                username,
                password: await hash(password, 8),
            }
        });
        delete user.password;

        return user;
    }

    async authenticateUser({username, password}: IUserRequest): Promise<IUserRequest> {
        const userMatch = await this.client.user.findFirst({
            where: {
                username
            }
        });

        if(!userMatch){
            throw new Error("Username not found")
        }

        if(compare(password, userMatch.password)){
            delete userMatch.password;
            return userMatch;
        }
    }
}