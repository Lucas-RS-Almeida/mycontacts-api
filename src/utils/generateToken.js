const jwt = require('jsonwebtoken');

module.exports = (params) => jwt.sign(params, process.env.JWT_SECRET);
