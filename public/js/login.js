/* eslint-disable */
import { showAlert } from './alert';

export const login = async (email, password) => {
  let realData;
  console.log(email, password);
  try {
    const data = await fetch('http://127.0.0.1:3000/api/v1/users/login', {
      method: 'POST',
      headers: {
        'Content-type': 'application/json; charset=UTF-8'
      },
      body: JSON.stringify({ email: email, password: password })
    });
    const realData = await data.json();
    console.log(realData);
    if (realData.status === 'Success') {
      showAlert('success', 'Logged In successfully');
      window.setTimeout(() => {
        location.assign('/');
      }, 1500);
    } else showAlert('error', realData.message);
  } catch (err) {
    showAlert('error', realData.message);
  }
};

// export const logout = async () => {
//   console.log('clicked')
//   try {
//     const data = await fetch('http://127.0.0.1:3000/api/v1/users/logout', {
//       method: 'GET',
//       headers: {
//         'Content-type': 'application/json; charset=UTF-8'
//       }
//     });
//     const realData = await data.json();
//     if (realData.status == 'Success') location.reload(true);
//   } catch (err) {
//     showAlert('error', 'Error logging out! Try again.');
//   }
// };
