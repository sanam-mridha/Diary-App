const CryptoJS = require('crypto-js');
const bcrypt = require('bcryptjs');

function encrypt(content, password) {
  return CryptoJS.AES.encrypt(content, password).toString();
}

function decrypt(cipherText, password) {
  const bytes = CryptoJS.AES.decrypt(cipherText, password);
  return bytes.toString(CryptoJS.enc.Utf8);
}

async function hashPassword(password) {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
}

async function comparePassword(password, hash) {
  return await bcrypt.compare(password, hash);
}

module.exports = { encrypt, decrypt, hashPassword, comparePassword };
