const { dbConnection, dbClose, insertQuery } = require('../db/db.helper');
const logger = require('winston');
const nanoid = require('nanoid');
const moment = require('moment');

exports.getClients = async function() {
  let db;
  try {
    db = await dbConnection();
    return await db.all(`SELECT * FROM clients`);
  } catch (error) {
    console.error(error)
  } finally {
    await dbClose(db)
  }
}

exports.createClient = async function(name) {
  let db;
  try {
    db = await dbConnection();
    const key = nanoid(48);
    const secret = nanoid(64);
    await db.run(insertQuery('clients', { name, key, secret, created_at: Date.now() }));
    return await db.get(`SELECT * FROM clients WHERE name = "${name}"`);
  } catch (error) {
    console.error(error)
  } finally {
    await dbClose(db)
  }
}

exports.generateOAuthToken = async function(key, secret) {
  let db;
  try {
    db = await dbConnection();

    const isValidClient = await verifyClient(key, secret);
    if (!isValidClient) { return; }

    const token = nanoid(32);
    await db.run(insertQuery('auth_tokens', {
      client_id: key,
      token,
      expires_at: moment().add(1, 'd').valueOf(),
      created_at: Date.now(),
    }));
    return token;
  } catch (error) {
    console.error(error)
  } finally {
    await dbClose(db)
  }
}

exports.isTokenValid = async function(token, key) {
  let db;
  try {
    db = await dbConnection();

    if (!(token && key)) { return false; }
    const oauthToken = await db.get(`SELECT * FROM auth_tokens WHERE client_id = "${key}" AND token = "${token}"`);

    return oauthToken && oauthToken.expires_at > new Date();
  } catch (error) {
    console.error(error)
  } finally {
    await dbClose(db)
  }
}

async function verifyClient(key, secret) {
  const client = await getClientById(key);
  return client && client.secret === secret;
}

async function getClientById(key) {
  let db;
  try {
    db = await dbConnection();
    return await db.get(`SELECT * FROM clients WHERE key = "${key}"`);
  } catch (error) {
    console.error(error)
  } finally {
    await dbClose(db)
  }
}
