var Crypt = (() => {
  let instance = new JSEncrypt({default_key_size: 2048});
  let encryptedPrivateKey = null;
  let encryptedAesKey = null;
  let aesKey = null;

  let load = (() => {
    chrome.storage.local.get("privateKey", (result) => {
      setEncryptedPrivateKey(result.privateKey);
      window.dispatchEvent(new CustomEvent("crypt:loaded", {detail: {privKeyExists: (typeof result.privateKey !== "undefined")}}));
    });
  })();

  let setEncryptedPrivateKey = (pk) => encryptedPrivateKey = pk;

  return {
    generateKeyPair: (password, callback) => {
      instance.getKey();
      chrome.storage.local.set({
        publicKey: instance.getPublicKeyB64(),
        privateKey: sjcl.encrypt(password, instance.getPrivateKeyB64())
      }, () => {
        chrome.runtime.sendMessage({pubKey: instance.getPublicKeyB64()});
        callback();
      });
    },
    decryptPrivateKey: (password, callback) => {
      try {
        let privateKey = sjcl.decrypt(password, encryptedPrivateKey);
        instance.setPrivateKey(privateKey);
        callback(true);
      } catch (e) {
        callback(false);
      }
    },
    decryptChunk: (chunk) => {
      if (encryptedAesKey === null || encryptedAesKey !== chunk.aesKey) {
        encryptedAesKey = chunk.aesKey;
        aesKey = instance.decrypt(chunk.aesKey);
      }
      if (!aesKey) { // chunk was encrypted with another private key
        return;
      }
      return {
        requests: (chunk.requests) ? 
          sjcl.decrypt(aesKey, chunk.requests)
          : [],
        js: (chunk.js) ? 
          sjcl.decrypt(aesKey, chunk.js)
          : [],
      };
    },        
  };
})();

export default Crypt;