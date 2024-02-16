import CryptoJS from "crypto-js";

export function encryptData(dataToEncrypt) {
  const { key, iv } = generateRandomKeyAndIV();
  const keyBytes = CryptoJS.enc.Base64.parse(key);
  const ivBytes = CryptoJS.enc.Base64.parse(iv);

  const utf8Stringified = CryptoJS.enc.Utf8.parse(dataToEncrypt);
  const encryptedData = CryptoJS.AES.encrypt(utf8Stringified, keyBytes, {
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
    iv: ivBytes,
  });

  return key + iv + encryptedData.toString();
}

function generateRandomKeyAndIV() {
  const key = CryptoJS.lib.WordArray.random(16).toString(CryptoJS.enc.Base64); 
  const iv = CryptoJS.lib.WordArray.random(16).toString(CryptoJS.enc.Base64); 
  return { key, iv };
}
