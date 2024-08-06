import { FastifyReply, FastifyRequest, HookHandlerDoneFunction } from 'fastify';
import { verify } from 'jsonwebtoken';
import 'dotenv/config';

export function authenticateUser(request: FastifyRequest, reply: FastifyReply, done: HookHandlerDoneFunction){
    const [ , token] = request.headers.authorization.split(" ");
    try{
        const { sub } = verify(token, process.env.TOKEN_SECRET);
        request.body = {
            ...(request.body as object),
            consumerId: sub
        }
        done();
    }catch(err){
        reply.status(401).send({
            error: "Invalid token"
        })
    }
    done();
}