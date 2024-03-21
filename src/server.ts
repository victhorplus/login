import express from "express";

const serve = express();

serve.get("/", (req, res) => {
    res.send("Olá")
})

serve.listen(3333, () => console.log("Servidor rodando na porta 3333"))