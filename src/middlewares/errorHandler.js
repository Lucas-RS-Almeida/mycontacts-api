module.exports = (error, _, response, next) => {
  console.log(error);
  response.sendStatus(500);
};
