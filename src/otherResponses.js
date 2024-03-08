const Discogs = require('disconnect').Client;

const disData = new Discogs({
  consumerKey: 'aehkkZekNnNeWDokAXAm',
  consumerSecret: 'tjOJPSpQcNTlnOjAhwrNiuYWugrNLGia',
}).database();

const albums = {};

const basicResponse = (request, response, status, object) => {
  const headers = {
    'Content-Type': 'application/json',
  };

  response.writeHead(status, headers);
  response.write(JSON.stringify(object));
  response.end();
};

const basicResponseHead = (request, response, status) => {
  const headers = {
    'Content-Type': 'application/json',
  };

  response.writeHead(status, headers);
  response.end();
};

const getAlbums = (request, response) => {
  const responseJSON = {
    albums,
  };

  return basicResponse(request, response, 200, responseJSON);
};

const getAlbumsHead = (request, response) => {
  basicResponseHead(request, response, 200);
};

const addAlbum = (request, response, body) => {
  const responseJSON = {
    message: 'Album name and comments are both required',
  };

  if (!body.albumName || !body.comments) {
    responseJSON.id = 'missingParams';
    return basicResponse(request, response, 400, responseJSON);
  }

  let responseCode = 204;

  if (!albums[body.albumName]) {
    responseCode = 201;
    albums[body.albumName] = {};
  }
  albums[body.albumName].albumName = body.albumName;
  albums[body.albumName].rating = body.rating;

  albums[body.albumName].comments = body.comments;

  // Image get request taken from https://github.com/bartve/disconnect at bottom of page
  // Could not get image to display properly
  disData.search(body.albumName, { type: 'master' }, (err, data) => {
    disData.getRelease(data.results[0].id, (err1, data1) => {
      disData.getImage(data1.images[0].resource_url, (err2, data2) => {
        albums[body.albumName].imageUrl = data2;
      });
    });
  });

  if (responseCode === 201) {
    responseJSON.message = 'Created Successfully';
    return basicResponse(request, response, responseCode, responseJSON);
  }

  return basicResponseHead(request, response, responseCode);
};

const notFound = (request, response) => {
  const responseJSON = {
    message: 'The page you request was not found.',
    id: 'notFound',
  };

  basicResponse(request, response, 404, responseJSON);
};

const notFoundHead = (request, response) => {
  basicResponseHead(request, response, 404);
};

module.exports = {
  basicResponse,
  basicResponseHead,
  getAlbums,
  getAlbumsHead,
  addAlbum,
  notFound,
  notFoundHead,
};
