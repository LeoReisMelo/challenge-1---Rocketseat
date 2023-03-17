import { Database } from './database.js';
import { randomUUID } from 'node:crypto';
import { buildRoutePath } from './utils/build-route-path.js';

const database = new Database();

export const routes = [
    {
        method: 'GET',
        path: buildRoutePath('/tasks'),
        handler: (req, res) => {
            const { search } = req.query;
            const tasks = database.select('tasks', search ? {
                title: search,
                description: search
            } : null);

            return res.end(JSON.stringify(tasks))
        }
    },
    {
        method: 'POST',
        path: buildRoutePath('/tasks'),
        handler: (req, res) => {
            const { title, description} = req.body;

            if (!title || !description) {
                return res.writeHead(400).end(JSON.stringify('Title or Description is not defined'))
            }

            const task = {
                id: randomUUID(),
                title,
                description,
                completed_at: null,
                created_at: new Date(),
                updated_ate: new Date()
            };

            database.insert('tasks', task);

            return res.writeHead(201).end();
        }
    },
    {
        method: 'PUT',
        path: buildRoutePath('/tasks/:id'),
        handler: (req, res) => {
            const { id } = req.params;
            const { title, description } = req.body;
            const task = database.findOne('tasks', id);

            if (task) {
                database.update('tasks', id, { 
                    title: title || task.title, 
                    description: description || task.description,
                    completed_at: task.completed_at,
                    created_at: task.created_at,
                    updated_at: new Date()
                });
            } else {
                return res.writeHead(404).end();
            }

            return res.writeHead(204).end();
        }
    },
    {
        method: 'PATCH',
        path: buildRoutePath('/tasks/:id/complete'),
        handler: (req, res) => {
            const { id } = req.params;
            const task = database.findOne('tasks', id);
            const {created_at, description, title} = task;

            if (task) {
                database.completeTask('tasks', id, { title, description, created_at });
            } else {
                return res.writeHead(404).end();
            }

            return res.writeHead(204).end();
        }
    },
    {
        method: 'DELETE',
        path: buildRoutePath('/tasks/:id'),
        handler: (req, res) => {
            const { id } = req.params;
            const task = database.findOne('tasks', id);

            if (task) {
                database.delete('tasks', id);
            } else {
                return res.writeHead(404).end();
            }

            return res.writeHead(204).end();
        }
    },
]