const bcrypt = require('bcryptjs');

const AuthRepository = require('../repositories/AuthRepository');

const isEmailValid = require('../../utils/isEmailValid');

const generateToken = require('../../utils/generateToken');

class AuthController {
  async logIn(request, response) {
    const { email: fieldEmail, password } = request.body;

    if (!fieldEmail || !password) {
      return response.status(400).json({ error: 'All fields are mandatory' });
    }

    if (!isEmailValid(fieldEmail)) {
      return response.status(400).json({ error: 'Enter a valid e-mail' });
    }

    try {
      const user = await AuthRepository.findByEmail(fieldEmail);
      if (!user) {
        return response.status(404).json({ error: 'User not found' });
      }

      if (!await bcrypt.compare(password, user.password)) {
        return response.status(400).json({ error: 'Invalid password' });
      }

      const { email } = user;

      response.json({
        user: { email },
        token: generateToken({ id: user.id }),
      });
    } catch {
      response.status(400).json({ error: 'Erro on sign in, try again' });
    }
  }

  async signUp(request, response) {
    const { email, password } = request.body;

    if (!email || !password) {
      return response.status(400).json({ error: 'All fields are mandatory' });
    }

    if (!isEmailValid(email)) {
      return response.status(400).json({ error: 'Enter a valid e-mail' });
    }

    if (password.length < 6) {
      return response.status(400).json({ error: 'Enter a forgote password' });
    }

    try {
      const emailAlreadyExists = await AuthRepository.findByEmail(email);
      if (emailAlreadyExists) {
        return response.status(400).json({ error: 'This e-mail in already in use' });
      }

      const salt = await bcrypt.genSalt(Number(process.env.BCRYPT_GEN_SALT));
      const passwordHashed = await bcrypt.hash(password, salt);

      await AuthRepository.create({ email, password: passwordHashed });

      response.sendStatus(201);
    } catch {
      response.status(400).json({ error: 'Erro on sign up, try again' });
    }
  }
}

module.exports = new AuthController();
