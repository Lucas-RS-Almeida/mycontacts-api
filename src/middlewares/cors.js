module.exports = (_, response, next) => {
  response.setHeader('Access-Control-Allow-Origin', `${process.env.URL_CONNECTION}`);
  response.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  response.setHeader('Access-Control-Allow-Methods', '*');
  response.setHeader('Access-Control-Max-Age', '10');

  next();
};
