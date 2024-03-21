import { UserService } from "../services/user.service";

let userService = new UserService();

export async function routes(server){
    server.get('/', (request, reply) => {
        reply.status(200).send("Olá Usuário")
    })

    server.post('/', async (request, reply) => {
        const result = await userService.create(request.body);
        reply.status(201).send(result)
    });
}