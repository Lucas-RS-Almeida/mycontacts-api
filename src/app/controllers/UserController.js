const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const UserRepository = require('../repositories/UserRepository');
const ContactRepository = require('../repositories/ContactRepository');

const isEmailValid = require('../../utils/isEmailValid');

const mailer = require('../../modules/mailer');

class UserController {
  async show(request, response) {
    const { userId } = request;

    try {
      const user = await UserRepository.findById(userId);
      if (!user) {
        return response.status(404).json({ error: 'User not found' });
      }

      const { email } = user;

      response.json(email);
    } catch {
      response.status(400).json({ error: 'Erro on get user, try again' });
    }
  }

  async changePassword(request, response) {
    const { currentPassword, newPassword } = request.body;
    const { userId } = request;

    if (!currentPassword || !newPassword) {
      return response.status(400).json({ error: 'All fields are mandatory' });
    }

    if (newPassword.length < 6) {
      return response.status(400).json({ error: 'Enter a forgote password' });
    }

    try {
      const user = await UserRepository.findById(userId);
      if (!user) {
        return response.status(404).json({ error: 'Your user not found' });
      }

      if (!await bcrypt.compare(currentPassword, user.password)) {
        return response.status(400).json({ error: 'Invalid password' });
      }

      const salt = await bcrypt.genSalt(Number(process.env.BCRYPT_GEN_SALT));
      const passwordHashed = await bcrypt.hash(newPassword, salt);

      await UserRepository.update(userId, {
        email: user.email, password: passwordHashed,
      });

      response.sendStatus(200);
    } catch {
      response.status(400).json({ error: 'Erro on change password, try again' });
    }
  }

  async changeEmail(request, response) {
    const { currentEmail, newEmail } = request.body;
    const { userId } = request;

    if (!currentEmail || !newEmail) {
      return response.status(400).json({ error: 'All fields are mandatory' });
    }

    if (!isEmailValid(currentEmail) || !isEmailValid(newEmail)) {
      return response.status(400).json({ error: 'E-mail is invalid' });
    }

    try {
      const user = await UserRepository.findById(userId);
      if (!user) {
        return response.status(404).json({ error: 'Your user not found' });
      }

      const userByEmail = await UserRepository.findByEmail(currentEmail);
      if (!userByEmail) {
        return response.status(404).json({ error: 'Not exists users with is e-mail' });
      }

      const emailExists = await UserRepository.findByEmail(newEmail);
      if (emailExists && emailExists.id !== userId) {
        return response.status(400).json({ error: 'This e-mail in already in use' });
      }

      const updateUser = await UserRepository.update(userId, {
        email: newEmail, password: user.password,
      });

      const { email } = updateUser;

      response.json(email);
    } catch {
      response.status(400).json({ error: 'Erro on update, try again' });
    }
  }

  async forgotPassword(request, response) {
    const { email } = request.body;

    if (!isEmailValid(email)) {
      return response.status(400).json({ error: 'E-mail invalid' });
    }

    try {
      const user = await UserRepository.findByEmail(email);
      if (!user) {
        return response.status(404).json({ error: 'This e-mail not register on app' });
      }

      const token = crypto.randomBytes(4).toString('hex');

      const now = new Date();
      now.setHours(now.getHours() + 1);

      mailer.sendMail({
        to: email,
        from: 'mycontacts@gmail.com',
        subject: 'My Contacts',
        text: 'Forgot password',
        html: `
          <p>
            Esqueceu sua senha? Não se preocupe, use esse token: ${token}
          </p>
        `,
      });

      await UserRepository.fourgoutPasword(user.id, { token, now });

      response.sendStatus(200);
    } catch {
      response.status(400).json({ error: 'Erro on forgot password, try again' });
    }
  }

  async resetPassword(request, response) {
    const { email, token, password } = request.body;

    if (!email || !token || !password) {
      return response.status(400).json({ error: 'All fields are mandatory' });
    }

    if (password.length < 6) {
      return response.status(400).json({ error: 'Enter a forgote password' });
    }

    try {
      const userExists = await UserRepository.findByEmail(email);
      if (!userExists) {
        return response.status(404).json({ error: 'User not exists' });
      }

      if (token !== userExists.password_reset_token) {
        return response.status(400).json({ error: 'Token invalid' });
      }

      const now = new Date();

      if (now > userExists.password_reset_expires) {
        return response.status(400).json({ error: 'Token expired, generate a new one' });
      }

      const salt = await bcrypt.genSalt(Number(process.env.BCRYPT_GEN_SALT));
      const passwordHashed = await bcrypt.hash(password, salt);

      await UserRepository.changePassword(userExists.id, passwordHashed);

      response.sendStatus(200);
    } catch {
      response.status(400).json({ error: 'Erro on change password, try again' });
    }
  }

  async delete(request, response) {
    const { userId } = request;

    try {
      const user = await UserRepository.findById(userId);
      if (!user) {
        return response.status(404).json({ error: 'User not found' });
      }

      await ContactRepository.deleteAll(userId);

      await UserRepository.delete(userId);

      response.sendStatus(204);
    } catch {
      response.status(400).json({ error: 'Erro on delete, try again' });
    }
  }
}

module.exports = new UserController();
