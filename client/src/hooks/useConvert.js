export async function convertBase64(file) {
  return new Promise((resolve, reject) => {
    let baseURL = "";
    // make new File Reader
    const reader = new FileReader();

    // conver file to base64
    reader.readAsDataURL(file);

    // onload
    reader.onloadend = () => {
      // make file info
      baseURL = reader.result;
      resolve(baseURL);
    };
    reader.onabort = () => {
      reject();
    };
  });
}
