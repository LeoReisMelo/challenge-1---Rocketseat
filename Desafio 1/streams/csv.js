import fs from 'node:fs';
import { parse } from 'csv-parse';
import formidable from 'formidable';
import http from 'node:http';

const records = [];

const server = http.createServer((req, res) => {
  if (req.url === '/tasks' && req.method.toLowerCase() === 'post') {
    const form = formidable({ multiples: false });
    form.parse(req, (err, fields, files) => {
      if (err) {
        console.error(err);
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Internal server error');
        return;
      }

      const filePath = files.file.filepath;

      const parser = parse({
        delimiter: ',',
        columns: true,
        skip_empty_lines: true
      });

      const input = fs.createReadStream(filePath);
      const output = fs.createWriteStream('output.json');

      input.pipe(parser);

      parser.on('readable', () => {
        let record;
        while ((record = parser.read())) {
            records.push(record);
        }
    });

    const tasks = [];

    parser.on('end', () => {
        records.forEach(record => {
            tasks.push(record);
        });

        output.write(`{ "tasks": ${JSON.stringify(tasks)}}`)
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end('{"status": "ok"}');
    });

    });
}
});

server.listen(3000, () => {
  console.log('Server started on port 3000');
});