import { UserService } from "../services/user.service";

let userService = new UserService();

export async function routes(server){
    server.get('/', (request, reply) => {
        return reply.status(200).send("Olá Usuário")
    })

    server.post('/', async (request, reply) => {
        const result = await userService.create(request.body);
        return reply.status(201).send(result)
    });

    server.post('/auth', async(request, reply) => {
        const result = await userService
            .authenticateUser(request.body)
            .catch(error => {
                return reply.status(401).send(error);
            });
        return reply.send(result)
    });
}