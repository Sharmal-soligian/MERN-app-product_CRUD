const CryptoJS = require("crypto-js");

function decryptData(encryptedData) {
  const randomKey = encryptedData.substring(0, 24); 
  const randomIv = encryptedData.substring(24, 48); 
  const ciphertext = encryptedData.substring(48);

  const key = CryptoJS.enc.Base64.parse(randomKey);
  const initVector = CryptoJS.enc.Base64.parse(randomIv);

  const decrypted = CryptoJS.AES.decrypt(
    {
      ciphertext: CryptoJS.enc.Base64.parse(ciphertext)
    },
    key,
    {
      iv: initVector,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    }
  );

  const decryptedText = decrypted.toString(CryptoJS.enc.Utf8);
  return decryptedText;
}

module.exports = {
  decryptData: decryptData
};
