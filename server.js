const http = require('http')
const fs = require('fs')
const path = require('path')
const cors_proxy = require('cors-anywhere')
const log = require('electron-log')

function startServer() {
  http.createServer(function (request, response) {
      let filePath = 'build' + request.url;
      if (filePath === 'build/')
        filePath = path.join('build','index.html');
      filePath = path.join(__dirname, filePath)
      console.log(filePath)

      let extname = path.extname(filePath);
      let contentType = 'text/html';
      switch (extname) {
        case '.js':
          contentType = 'text/javascript';
          break;
        case '.css':
          contentType = 'text/css';
          break;
        case '.json':
          contentType = 'application/json';
          break;
        case '.png':
          contentType = 'image/png';
          break;      
        case '.jpg':
          contentType = 'image/jpg';
          break;
        case '.wav':
          contentType = 'audio/wav';
          break;
      }

      fs.readFile(filePath, function(error, content) {
        if (error) {
          if(error.code == 'ENOENT'){
            fs.readFile('404.html', function(error, content) {
              response.writeHead(200, { 'Content-Type': contentType });
              response.end(content, 'utf-8');
            });
          } else {
            response.writeHead(500);
            response.end('Sorry, check with the site admin for error: '+error.code+' ..\n');
            response.end(); 
          }
        }
        else {
          response.writeHead(200, { 'Content-Type': contentType });
          response.end(content, 'utf-8');
        }
      });
  }).listen(8888);
  console.log('Server running at http://127.0.0.1:8888/');

  cors_proxy.createServer({
    originWhiteList: [],
    requireHeader: ['origin', 'x-requested-with'],
    removeHeaders: ['cookie', 'cookie2']
  }).listen(8889);
  console.log('CORS server at http://127.0.0.1:8889/');

  http.createServer(function(req,res){
    console.log(req)
    let [command, level, message] = req.url.slice(1).split('/');
    const levels = ['error', 'warn', 'info', 'debug'];
    if(command === "log"){
      if(level >= levels.length){
        res.writeHead(500, { 'Content-Type': 'json' });
        res.end(JSON.stringify({'message': "couldnt log", 'error': "invalid level"})) 
      }
      log[levels[level]](message);
      res.writeHead(200, { 'Content-Type': 'json' });
      res.end(JSON.stringify({'success': message})) 
    }
  }).listen(8887)
  console.log('log server at http://127.0.0.1:8887/');
}

if (require.main === module)
    startServer()

module.exports.startServer = startServer;
