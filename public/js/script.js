/*eslint-disable*/

import axios from 'axios';
import { showAlert } from './alert';

export const login = async (email, password) => {
  console.log(email, `${password}`);
  try {
    const res = await axios({
      method: 'post',
      url: '/api/v1/users/login',
      data: {
        email: email,
        password: `${password}`,
      },
    });

    // console.log(res);
    if (res.data.status === 'success') {
      showAlert('success', 'Logged in successfully');
      window.setTimeout(() => {
        location.assign('/');
      }, 1500);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};

export const logout = async () => {
  try {
    const res = await axios({
      method: 'get',
      url: '/api/v1/users/logout',
    });

    if (res.data.status == 'success') {
      showAlert('success', 'Logged out successfully');
      window.setTimeout(() => {
        location.assign('/');
      }, 1500);
    }
  } catch (err) {
    showAlert('error', 'Error logging out! Try again');
  }
};

exports.signin = async (name, email, password, passwordConfirm) => {
  try {
    const res = await axios({
      method: 'post',
      url: '/api/v1/users/signup',
      data: {
        email,
        password,
        passwordConfirm,
        name,
      },
    });

    console.log(res);
    if (res.data.status === 'success') {
      showAlert('success', 'signed up successfully');
      window.setTimeout(() => {
        location.assign('/');
      }, 1500);
    }
  } catch (err) {
    console.log(err);
    showAlert('error', err.response.data.message);
  }
};
