import { FastifyInstance } from "fastify";
import { authenticateUser } from "../../middlewares";
import { UserService } from "./user.service";
import { IUserRequest } from "../../interfaces";

let userService = new UserService();

export async function UserController(server: FastifyInstance){
    server.get('/', (request, reply) => {
        return reply.status(200).send("Olá Usuário")
    })

    server.post('/', async (request, reply) => {
        const result = await userService.create(request.body as IUserRequest);
        return reply.status(201).send(result)
    });

    server.post('/auth', async(request, reply) => {
        const result = await userService
            .authenticateUser(request.body as IUserRequest)
        return reply.send(result)
    });

    server.get('/users', { preValidation: authenticateUser }, async (request, reply) => {
        const result = await userService.getUsers();
        reply.status(201).send(result);
    });

    server.delete('/:id', async (request, reply) => {
        userService
            .deleteUser(request.params as IUserRequest)
        return reply.status(202).send();
    })
}