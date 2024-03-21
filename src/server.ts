import { fastify } from "fastify";
import { routes as userRoutes } from './controllers';

export const server = fastify();

server.register(userRoutes, { prefix: 'user' });
// userRoutes(server);

server.listen({port: 3333 }, () => console.log("Servidor rodando na porta 3333"))