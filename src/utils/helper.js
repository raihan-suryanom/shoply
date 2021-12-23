import axios from 'axios';
import { GiRoundStar } from 'react-icons/gi';
import { LOG_OUT } from '../reducers/actions';
import { messageNotifications } from './constant';

const BASE_URL = 'https://fakestoreapi.com/';

export const trimmingText = (text, margin = 15) => {
  return text.length > margin ? `${text.substr(0, margin)}...` : text;
};

export const totalCarts = (carts) => {
  return carts.reduce((acc, cur) => acc + cur.quantity, 0);
};

export const createRatingStars = (rate) => {
  const rating = parseInt(rate);
  const starIcons = Array(5)
    .fill(null)
    .map((_, index) =>
      rating > index ? (
        <GiRoundStar key={index} />
      ) : (
        <GiRoundStar style={{ color: '#484543' }} key={index} />
      )
    );
  return starIcons;
};

export const didUserEnterValidOption = (filter) => {
  const { category, min, max } = filter;
  const emptyRange = max === '' && min === '';
  const isThereInput = !(
    (min === '' && max !== '') ||
    (min !== '' && max === '')
  );

  return (
    (!emptyRange && isThereInput) ||
    (category && !(emptyRange || !emptyRange)) ||
    (category && emptyRange)
  );
};

export const getUserFromLocalStorage = () => {
  if (typeof window !== 'undefined') {
    const savedData = localStorage.getItem('user');
    const initialValue = JSON.parse(savedData);
    return initialValue || null;
  }

  return null;
};

export const getData = async (query) => {
  try {
    const res = await axios(`${BASE_URL}${query}`);
    const data = await res.data;
    return data;
  } catch (error) {
    throw new Error(error);
  }
};

export const getUser = async (type, method = 'get', data) => {
  const url = {
    admin: '/api/admin',
    user: 'https://fakestoreapi.com/auth/login',
  };

  try {
    const res = await axios({ url: url[type], method, data });
    const user = await res.data;
    return user;
  } catch (_) {
    return null;
  }
};

export const logout = (dispatch, router, addToast) => {
  dispatch({ type: LOG_OUT });
  router.replace('/login');
  addToast(
    messageNotifications.LOGOUT_SUCCESS.message,
    messageNotifications.LOGOUT_SUCCESS.status
  );
};

export const hasObjectValue = (value) => {
  for (let i in value) return true;
  return false;
};

export const formatUrl = (query) => {
  let url = 'products';
  let finalQuery = query;

  if (hasObjectValue(finalQuery)) {
    finalQuery = moveCategoryKeyToFront(finalQuery);

    const keys = Object.keys(finalQuery);
    const values = Object.values(finalQuery);

    for (let index = 0; index < keys.length; index + 1) {
      const isSpecialCases = keys[index] !== 'category';
      const firstSymbol = isSpecialCases
        ? url.includes('?')
          ? '&'
          : '?'
        : '/';
      const secondSymbol = isSpecialCases ? '=' : '/';
      url += `${firstSymbol}${keys[index]}${secondSymbol}${values[index]}`;
    }
  }

  return url;
};

const moveCategoryKeyToFront = (object) => {
  let list = object;

  if (list?.category) {
    const temp = list.category;
    delete list.category;

    list = { category: temp, ...list };
  }

  return list;
};
