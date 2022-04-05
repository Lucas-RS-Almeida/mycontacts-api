const jwt = require('jsonwebtoken');

module.exports = (request, response, next) => {
  const { authorization } = request.headers;

  if (!authorization) {
    return response.status(401).json({ error: 'No token provided' });
  }

  const parts = authorization.split(' ');
  if (!parts.length === 2) {
    return response.status(401).json({ error: 'Token error' });
  }

  const [scheme, token] = parts;

  if (!/^Bearer$/i.test(scheme)) {
    return response.status(401).json({ error: 'Token malformatted' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (error, encoded) => {
    if (error) return response.status(401).json({ error: 'Token invalid' });

    request.userId = encoded.id;
    return next();
  });
};
