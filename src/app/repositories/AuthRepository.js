const db = require('../../database');

class AuthRepository {
  async findByEmail(email) {
    const [row] = await db.query(`
      SELECT *
      FROM users
      WHERE email = $1
    `, [email]);
    return row;
  }

  async create({ email, password }) {
    const [row] = await db.query(`
      INSERT INTO users (email, password)
      VALUES ($1, $2)
      RETURNING *
    `, [email, password]);
    return row;
  }
}

module.exports = new AuthRepository();
