import http from 'node:http';
import { json } from './middlewares/json.js';
import { routes } from './routes.js';
import { extractQueryParams } from './utils/extract-query-params.js';

// Aplicações HTTP -> APIs
// Common JS - Require
// ESModules -> Import/Export

// HTTP
// - Método HTTP
// - Url

// GET, POST, PUT, PATCH e DELETE

// GET -> Buscar recursos do backend
// POST -> Criar uma recurso no backend
// PUT -> Editar ou atualizar um recurso no backend
// PATCH -> Atualizar uma informação especifica de um recurso no backend
// DELETE -> Deletar um recurso no backend

// Stateful -> Stateless

// JSON - Javascript Object Notation

// Cabeçalhos (Requisição/Resposta) -> Metadados

// HTTP Status Code

// UUID - Universal Unique Identifier

/**
 * Query Parameters -> http://localhost:3333?userId=1&name=Leonardo -> URL Stateful
 * Route Parameter -> http://localhost:333/users/1 -> Identificação de recurso
 * Request Body -> Envio de informações de um formulário
 */

const server = http.createServer(async (req, res) => {
    const { method,url } = req;

    await json(req, res);

    const route = routes.find(route => {
        return route.method === method && route.path.test(url);
    });

    if (route) {
        const routeParams = req.url.match(route.path);
        const { query, ...params } = routeParams.groups;

        req.params = params;
        req.query = query ? extractQueryParams(query) : {};

        return route.handler(req, res);
    }

    return res.writeHead(404).end();
});

server.listen(3333);