const http = require('http');
const fs = require('fs');

const hostname = '127.0.0.1';
const port = 4200;

function stringifyMaps(rawMapsObject) {
    let fileContent = 'export let RawMaps = {\n';
    let firstMap = true;
    Object.keys(rawMapsObject).forEach(key => {
        if (firstMap) {
            firstMap = false;
        } else {
            fileContent += ',\n';
        }
        let rawMap = rawMapsObject[key];
        fileContent += `    ${key}:\n`;
        fileContent += '    `';
        let firstLine = true;
        rawMap.split('\n').forEach(line => {
            if (firstLine) {
                firstLine = false;
            } else {
                fileContent += '\n    ';
            }
            let firstCell = true;
            line.split('\t').forEach(cell => {
                if (firstCell) {
                    firstCell = false;
                } else {
                    fileContent += '\t';
                }
                fileContent += cell.trim();
            });
        });
        fileContent += '`'
    });
    fileContent += '\n};';
    return fileContent;
}

function writeMaps(rawMapsObject) {
    let ok = true;
    try {
        fs.writeFileSync(__dirname + '/content/RawMaps.ts', stringifyMaps(rawMapsObject));
    } catch (error) {
        console.log(error);
        ok = false;
    }
    return ok;
}

const server = http.createServer((req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    if (req.method === 'OPTIONS') {
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Accept, Origin, Authorization');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
        return res.end();
    }
    if (req.method != 'POST') {
        console.log('Request is not POST');
        res.statusCode = 405;
        return res.end('{"error": "Method not allowed"}');
    }
    let body = '';
    req.on('data', (data) => {
        body += data;
    });
    req.on('end', () => {
        let ok = writeMaps(JSON.parse(body));
        res.writeHead(200, {'Content-Type': 'application/json; charset=UTF-8'});
        res.end(`{"result": "save ${ok ? 'ok' : 'ko'}"}`);
    });
});

server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});