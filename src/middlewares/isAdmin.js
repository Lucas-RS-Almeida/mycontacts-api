const UserRepository = require('../app/repositories/UserRepository');

module.exports = async (request, response, next) => {
  const { userId } = request;

  const user = await UserRepository.findById(userId);
  if (!user) {
    return response.status(404).json({ error: 'Admin not found!' });
  }

  if (user.is_admin === false) {
    return response.status(400).json({ error: 'This page can only be accessed by admin' });
  }

  next();
};
