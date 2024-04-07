import { FastifyReply, FastifyRequest, HookHandlerDoneFunction } from 'fastify';
import { verify } from 'jsonwebtoken';
import 'dotenv/config';

export function authenticateUser(request: FastifyRequest, reply: FastifyReply, done: HookHandlerDoneFunction){
    console.log("Middleware")
    const [ , token] = request.headers.authorization.split(" ");
    console.log("Token:", token);
    try{
        verify(token, process.env.TOKEN_SECRET);
        done();
    }catch(err){
        reply.status(401).send({
            error: "Invalid token"
        })
    }
    done();
}