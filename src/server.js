const http = require('http');
const url = require('url');
const query = require('querystring');
const htmlHandler = require('./htmlResponses.js');
const otherHandler = require('./otherResponses.js');

const Discogs = require('disconnect').Client;

let dis = new Discogs({
  consumerKey: 'aehkkZekNnNeWDokAXAm',
  consumerSecret: 'tjOJPSpQcNTlnOjAhwrNiuYWugrNLGia'
}).database();


dis.search('Images and Words', {type: 'master'}, function(err, data){
	console.log(data);
});
console.log(dis);
const port = process.env.PORT || process.env.NODE_PORT || 3000;

const urlStruct = {
  GET: {
    '/': htmlHandler.getIndex,
    '/style.css': htmlHandler.getCSS,
    '/getUsers': otherHandler.getUsers,
    '/notReal': otherHandler.notReal,
    notFound: otherHandler.notFound,
  },
  HEAD: {
    '/getUsers': otherHandler.getUsersHead,
    '/notReal': otherHandler.notReal,
    notFound: otherHandler.notFoundHead,
  },
  POST: {
    '/addUser': otherHandler.addUser,
  },
};

const parseBody = (request, response, handler) => {
  const body = [];

  request.on('error', (err) => {
    console.dir(err);
    response.statusCode = 400;
    response.end();
  });

  request.on('data', (chunk) => {
    body.push(chunk);
  });

  request.on('end', () => {
    const bodyString = Buffer.concat(body).toString();
    const bodyParams = query.parse(bodyString);

    handler(request, response, bodyParams);
  });
};

const onRequest = (request, response) => {
  console.log(request.url);

  const parsedUrl = url.parse(request.url);

  if (!urlStruct[request.method]) {
    return urlStruct.HEAD.notFound(request, response, params);
  }

  if (request.method === 'POST' && parsedUrl.pathname === '/addUser') {
    return parseBody(request, response, otherHandler.addUser);
  }

  if (urlStruct[request.method][parsedUrl.pathname]) {
    return urlStruct[request.method][parsedUrl.pathname](request, response);
  }

  return urlStruct[request.method].notFound(request, response);
};

http.createServer(onRequest).listen(port, () => {
  console.log(`Listening of 127.0.0.1:${port}`);
});
