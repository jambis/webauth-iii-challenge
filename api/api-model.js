const db = require("../data/dbConfig");

module.exports = { getBy, add };

async function getBy(filter) {
  try {
    const result = await db("users").where(filter);

    return result.length > 1
      ? result
      : result.reduce((acc, curr) => (acc = curr), {});
  } catch (err) {
    console.error(err);
  }
}

async function add(userData) {
  try {
    const [id] = await db("users").insert(userData);

    const user = await db("users")
      .where({ id })
      .first();

    return user;
  } catch (err) {
    console.error(err);
  }
}
