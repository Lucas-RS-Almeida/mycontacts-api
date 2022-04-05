const db = require('../../database');

class ContactRepository {
  async findAll(userId, orderBy = 'ASC') {
    const direction = orderBy.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';
    const rows = await db.query(`
      SELECT contacts.*, categories.name AS category_name
      FROM contacts
      LEFT JOIN categories ON contacts.category_id = categories.id
      WHERE contacts.user_id = $1
      ORDER BY name ${direction}
    `, [userId]);
    return rows;
  }

  async findById(userId, id) {
    const [row] = await db.query(`
      SELECT *
      FROM contacts
      WHERE user_id = $1 AND id = $2
    `, [userId, id]);
    return row;
  }

  async findByEmail(userId, email) {
    const [row] = await db.query(`
      SELECT *
      FROM contacts
      WHERE user_id = $1 AND email = $2
    `, [userId, email]);
    return row;
  }

  async create({
    userId, name, email, phone, categoryId = null,
  }) {
    const [row] = await db.query(`
      INSERT INTO contacts (user_id, name, email, phone, category_id)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `, [userId, name, email, phone, categoryId]);
    return row;
  }

  async update(userId, id, {
    name, email, phone, categoryId,
  }) {
    const [row] = await db.query(`
      UPDATE contacts
      SET name = $1, email = $2, phone = $3, category_id = $4
      WHERE user_id = $5 AND id = $6
      RETURNING *
    `, [name, email, phone, categoryId, userId, id]);
    return row;
  }

  async delete(userId, id) {
    const deleteOp = await db.query(`
      DELETE
      FROM contacts
      WHERE user_id = $1 AND id = $2
    `, [userId, id]);
    return deleteOp;
  }

  async deleteAll(userId) {
    const deleteOp = await db.query(`
      DELETE
      FROM contacts
      WHERE user_id = $1
    `, [userId]);
    return deleteOp;
  }
}

module.exports = new ContactRepository();
