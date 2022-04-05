const ContactRepository = require('../repositories/ContactRepository');
const UserRepository = require('../repositories/UserRepository');
const CategoryRepository = require('../repositories/CategoryRepository');

const isEmailValid = require('../../utils/isEmailValid');

class ContactController {
  async index(request, response) {
    const { orderBy } = request.query;
    const { userId } = request;

    const contacts = await ContactRepository.findAll(userId, orderBy);

    response.json(contacts);
  }

  async show(request, response) {
    const { id } = request.params;
    const { userId } = request;

    try {
      const contact = await ContactRepository.findById(userId, id);
      if (!contact) {
        return response.status(400).json({ error: 'Contact not found' });
      }

      response.json(contact);
    } catch {
      response.status(400).json({ error: 'Erro on get contact, try agayn' });
    }
  }

  async store(request, response) {
    const {
      name, email, phone,
    } = request.body;
    let { categoryId } = request.body;
    const { userId } = request;

    if (!name) {
      return response.status(400).json({ error: 'Name is required' });
    }

    if (email && !isEmailValid(email)) {
      return response.status(400).json({ error: 'E-mail invalid' });
    }

    if (!categoryId) {
      categoryId = undefined;
    }

    try {
      const userExists = await UserRepository.findById(userId);
      if (!userExists) {
        return response.status(404).json({ error: 'Your user not found' });
      }

      const emailExists = await ContactRepository.findByEmail(userId, email);
      if (emailExists) {
        return response.status(400).json({ error: 'This e-mail already exists in your contacts' });
      }

      if (categoryId) {
        const categoryExists = await CategoryRepository.findById(categoryId);
        if (!categoryExists) {
          return response.status(404).json({ error: 'This category not exists' });
        }
      }

      const newContact = await ContactRepository.create({
        userId, name, email, phone, categoryId,
      });

      response.status(201).json(newContact);
    } catch (error) {
      console.log(error);
      response.status(400).json({ error: 'Erro on create contact, try again' });
    }
  }

  async update(request, response) {
    const {
      name, email, phone,
    } = request.body;
    let { categoryId } = request.body;
    const { id } = request.params;
    const { userId } = request;

    if (!name) {
      return response.status(400).json({ error: 'Name is required' });
    }

    if (email && !isEmailValid(email)) {
      return response.status(400).json({ error: 'E-mail invalid' });
    }

    if (!categoryId) {
      categoryId = undefined;
    }

    try {
      const userExists = await UserRepository.findById(userId);
      if (!userExists) {
        return response.status(404).json({ error: 'Your user not found' });
      }

      const contactExists = await ContactRepository.findById(userId, id);
      if (!contactExists) {
        return response.status(404).json({ error: 'Contacat not found' });
      }

      const emailExists = await ContactRepository.findByEmail(userId, email);
      if (emailExists && emailExists.id !== contactExists.id) {
        return response.status(400).json({ error: 'This e-mail already exists in your contacts' });
      }

      if (categoryId) {
        const categoryExists = await CategoryRepository.findById(categoryId);
        if (!categoryExists) {
          return response.status(404).json({ error: 'This category not exists' });
        }
      }

      const contactUpdated = await ContactRepository.update(userId, id, {
        name, email, phone, categoryId,
      });

      response.json(contactUpdated);
    } catch (error) {
      response.status(400).json({ error: 'Erro on create contact, try again' });
    }
  }

  async delete(request, response) {
    const { id } = request.params;
    const { userId } = request;

    await ContactRepository.delete(userId, id);

    response.sendStatus(204);
  }
}

module.exports = new ContactController();
