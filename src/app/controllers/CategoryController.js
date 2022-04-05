const CategoryRepository = require('../repositories/CategoryRepository');

class CategoryController {
  async index(_, response) {
    const categories = await CategoryRepository.findAll();

    response.json(categories);
  }

  async show(request, response) {
    const { id } = request.params;

    try {
      const category = await CategoryRepository.findById(id);
      if (!category) {
        return response.status(404).json({ error: 'Category not found' });
      }

      response.json(category);
    } catch {
      response.status(400).json({ error: 'Erro on get category, try again' });
    }
  }

  async store(request, response) {
    const { name } = request.body;

    if (!name) {
      return response.status(400).json({ error: 'Name is required' });
    }

    try {
      const categoryExists = await CategoryRepository.findByName(name);
      if (categoryExists) {
        return response.status(400).json({ error: 'Category already exists' });
      }

      const newCategory = await CategoryRepository.create(name);

      response.status(201).json(newCategory);
    } catch {
      response.status(400).json({ error: 'Erro on create category, try again' });
    }
  }

  async update(request, response) {
    const { id } = request.params;
    const { name } = request.body;

    if (!name) {
      return response.status(400).json({ error: 'Name is required' });
    }

    try {
      const categoryExists = await CategoryRepository.findByName(name);
      if (categoryExists) {
        return response.status(400).json({ error: 'Category already exists with is name' });
      }

      const categoryUpdated = await CategoryRepository.update(id, name);

      response.json(categoryUpdated);
    } catch {
      response.status(400).json({ error: 'Erro on create category, try again' });
    }
  }

  async delete(request, response) {
    const { id } = request.params;

    try {
      const categoryExists = await CategoryRepository.findById(id);
      if (!categoryExists) {
        return response.status(400).json({ error: 'Category not found' });
      }

      await CategoryRepository.delete(id);

      response.sendStatus(204);
    } catch {
      response.status(400).json({ error: 'Erro on delete category, try again' });
    }
  }
}

module.exports = new CategoryController();
