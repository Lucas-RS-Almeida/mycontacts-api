const db = require('../../database');

class UserRepository {
  async findById(id) {
    const [row] = await db.query(`
      SELECT *
      FROM users
      WHERE id = $1
    `, [id]);
    return row;
  }

  async findByEmail(email) {
    const [row] = await db.query(`
      SELECT *
      FROM users
      WHERE email = $1
    `, [email]);
    return row;
  }

  async fourgoutPasword(id, { token, now }) {
    await db.query(`
      UPDATE users
      SET password_reset_token = $1, password_reset_expires = $2
      WHERE id = $3
    `, [token, now, id]);
  }

  async changePassword(id, password) {
    await db.query(`
      UPDATE users
      SET password = $1
      WHERE id = $2
    `, [password, id]);
  }

  async update(id, { email, password }) {
    const [row] = await db.query(`
      UPDATE users
      SET email = $1, password = $2
      WHERE id = $3
      RETURNING *
    `, [email, password, id]);
    return row;
  }

  async delete(id) {
    const deleteOp = await db.query(`
      DELETE
      FROM users
      WHERE id = $1
    `, [id]);
    return deleteOp;
  }
}

module.exports = new UserRepository();
