const { Client } = require('pg');

const client = new Client({
  user: 'fishpaol',
  host: 'ep-aged-shape-00535486.eu-central-1.aws.neon.tech',
  database: 'ChukkaBD',
  password: 'CJqXRhO4a7on',
  port: 5432,
});

async function connect() {
  try {
    await client.connect();
    console.log('Connected to PostgreSQL');
  } catch (error) {
    console.error('Error connecting to PostgreSQL', error);
  }
}

async function query(sql, params = []) {
  try {
    const result = await client.query(sql, params);
    return result.rows;
  } catch (error) {
    console.error('Error executing query', error);
    throw error;
  }
}

async function disconnect() {
  try {
    await client.end();
    console.log('Connection to PostgreSQL closed');
  } catch (error) {
    console.error('Error closing connection to PostgreSQL', error);
  }
}

module.exports = {
  connect,
  query,
  disconnect,
};
