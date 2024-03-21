import { PrismaClient } from "@prisma/client";
import { IUserRequest } from "../interfaces";
import { Hash, createHash } from "node:crypto";

export class UserService {
    client: PrismaClient;
    
    constructor() {
        this.client = new PrismaClient();
    }

    async create({ name, username, password }: IUserRequest) {
        const userAlreadyExist = await this.client.user.findFirst({
            where: {
                username
            }
        });

        if(userAlreadyExist){
            throw new Error("User already exists!");
        }

        const passwordHash: Hash = createHash('sha256').update(password);
        const user = await this.client.user.create({
            data: {
                name,
                username,
                password: '' + passwordHash,
            }
        });

        return user;
    }
}