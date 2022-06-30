/* eslint-disable */
// import { showAlert } from './alert';
// import axios from 'axios';

// export const updateSettings = async (Data, type) => {
//   try {
//     // console.log(Data,type);
//     const url =
//       type === 'password'
//         ? 'http://127.0.0.1:3000/api/v1/users/updateMyPassword'
//         : 'http://127.0.0.1:3000/api/v1/users/updateMe';
//     const res = await axios({
//       method: 'PATCH',
//       url,
//       Data
//     });
//     if (res.data.status === 'Success') {
//       showAlert('success', `${type.toUpperCase()} Updated successfully')`);
//     }
//   } catch (err) {
//     // console.log( err.response)
//     showAlert('error', err.response.data.message);
//   }
// };
