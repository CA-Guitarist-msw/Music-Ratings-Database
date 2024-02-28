const users = {};

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

const getUsers = (request, response) => {
  const responseJSON = {
    users,
  };

  return basicResponse(request, response, 200, responseJSON);
};

const getUsersHead = (request, response) => {
  basicResponseHead(request, response, 200);
};

const addUser = (request, response, body) => {
  const responseJSON = {
    message: 'Name and age are both required.',
  };

  if (!body.name || !body.age) {
    responseJSON.id = 'missingParams';
    return basicResponse(request, response, 400, responseJSON);
  }

  let responseCode = 204;

  if (!users[body.name]) {
    responseCode = 201;
    users[body.name] = {};
  }

  users[body.name].name = body.name;
  users[body.name].age = body.age;

  if (responseCode === 201) {
    responseJSON.message = 'Created Successfully';
    return basicResponse(request, response, responseCode, responseJSON);
  }

  return basicResponseHead(request, response, responseCode);
};

const notReal = (request, response) => {
  const responseJSON = {
    message: 'The user you requested is not real',
    id: 'notReal',
  };

  basicResponse(request, response, 404, responseJSON);
};

const notRealHead = (request, response) => {
  basicResponseHead(request, response, 404);
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
  getUsers,
  getUsersHead,
  addUser,
  notReal,
  notRealHead,
  notFound,
  notFoundHead,
};
