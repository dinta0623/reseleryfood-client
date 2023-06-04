import localforage from "localforage";
import jwtDecode from "jwt-decode";
import CryptoJS from "crypto-js";

export const useJwtDecode = (token, ...opts) => jwtDecode(token, opts);
export const useHash = (key, secret = import.meta.env.VITE_SECRET) => {
  key = CryptoJS.SHA256(key, secret);
  return key.toString();
};
export const useEncrypt = (data, secret = import.meta.env.VITE_SECRET) => {
  data = CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse(data), secret);
  return data.toString();
};
export const useDecrypt = (data, secret = import.meta.env.VITE_SECRET) => {
  data = CryptoJS.AES.decrypt(data, secret);
  return data.toString(CryptoJS.enc.Utf8);
};

export const configStorage = () => {
  localforage.config({
    driver: localforage.INDEXEDDB, // Force WebSQL; same as using setDriver()
    name: "myApp",
    version: 1.0,
    storeName: "tampung", // Should be alphanumeric, with underscores.
    description: "store datas",
  });
};

export const useStorage = async (id, value, instance = false) => {
  let result;
  const store = async (payload) => await localforage.getItem(useHash(payload));

  if (instance) {
    result = localforage;
  } else if (value === undefined && (await store(id))) {
    result = JSON.parse(useDecrypt(await store(id)));
  } else if (id && value === null) {
    await localforage.removeItem(useHash(id));
  } else if (id && !!value) {
    const newVal = useEncrypt(JSON.stringify(value));
    await localforage.setItem(useHash(id), newVal);
    result = newVal;
  }

  return result || undefined;
};
