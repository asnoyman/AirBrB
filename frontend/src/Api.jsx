import BACKEND_PORT from './config.json';

export const apiRequest = (path, data, type) => {
  let useData = true;
  if (type === 'GET' || type === 'DELETE') useData = false;
  const fetchOptions = {
    method: type,
    body: useData ? JSON.stringify(data) : undefined,
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + localStorage.getItem('token'),
    },
  };

  return new Promise((resolve, reject) => {
    fetch(`http://localhost:${BACKEND_PORT.BACKEND_PORT}/` + path, fetchOptions)
      .then((response) => {
        if (response.status !== 200) {
          response.json().then((error) => {
            reject(error);
          });
        } else {
          response.json().then((json) => {
            resolve(json);
          });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  });
};
