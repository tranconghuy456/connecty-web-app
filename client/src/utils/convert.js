// base64 to array buffer
const base64ToArrayBuffer = async (base64) => {
  return new Promise((resolve, reject) => {
    try {
      const binaryString = atob(base64.replace(/-/g, "+").replace(/_/g, "/"));
      const bytes = new Uint8Array(binaryString.length);

      for (var i = 0; i < binaryString.length; i++)
        bytes[i] = binaryString.charCodeAt(i);
      resolve(bytes.buffer);
      console.log(bytes.buffer);
    } catch (e) {
      console.log(e);
      reject(e);
    }
  });
};

// file to base64
const fileToBase64 = async (file) => {
  return new Promise((resolve, reject) => {
    // init File Reader
    const reader = new FileReader();

    // convert file to base64
    reader.readAsDataURL(file);

    // succeed
    reader.onload = () => {
      resolve(reader.result);
    };
    // failed
    reader.onabort = () => {
      reject();
    };
  });
};

// file to Blob
const fileToBlob = async (file) => {
  return new Promise((resolve, reject) => {
    try {
      const blob = new Blob([file], { type: file.type });
      resolve(blob);
    } catch (e) {
      reject(e);
    }
  });
};

export { base64ToArrayBuffer, fileToBase64, fileToBlob };
