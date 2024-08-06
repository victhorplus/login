import { fastify } from "fastify";
import { UserController } from './use-cases/user/user.controler';

export const server = fastify();

server.register(UserController, { prefix: 'user' });
server.setErrorHandler((error, request, reply) => {
    return reply.status(401).send({
        status: "Error",
        error: error.message,
    })
})
// userRoutes(server);

server.listen({port: 3333 }, () => console.log("Servidor rodando na porta 3333"))