const crypto = require('crypto');
const config = require('./../config/config');


/**
 * 加密
 * @param  {string} text   需要加密的字符串
 * @param  {string} [keys] 密钥，默认为 config.secret
 * @return {string}        加密后的字符串
 */
const cipher = (text, keys) => {
  const secret = keys || config.secretCipher;
  const cryptoCipher = crypto.createCipher('aes192', secret);
  let encrypted = cryptoCipher.update(text, 'utf8', 'hex');
  encrypted += cryptoCipher.final('hex');
  console.log(encrypted);
};


/**
 * 解密
 * @param  {string} text   需要解密的字符串
 * @param  {string} [keys] 密钥，默认为 config.secret
 * @return {string}        解密后的字符串
 */
const decipher = (text, keys) => {
  const secret = keys || config.secretCipher;
  const cryptoDecipher = crypto.createDecipher('aes192', secret);
  let decrypted = cryptoDecipher.update(text, 'hex', 'utf8');
  decrypted += cryptoDecipher.final('utf8');
  console.log(decrypted);
};


module.exports = {
  cipher,
  decipher,
};
