import axios from 'axios';
import { GiRoundStar } from 'react-icons/gi';

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
  } else {
    return null;
  }
};

export const getData = async (query) => {
  try {
    const res = await axios(`${BASE_URL}${query}`);
    const data = await res.data;
    return data;
  } catch (error) {
    console.log(error);
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

export const hasObjectValue = (value) => {
  for (var i in value) return true;
  return false;
};

export const formatUrl = (query) => {
  let url = 'products',
    finalQuery = query;
  if (hasObjectValue(finalQuery)) {
    finalQuery = moveCategoryKeyToFront(finalQuery);

    const keys = Object.keys(finalQuery);
    const values = Object.values(finalQuery);

    for (let index = 0; index < keys.length; index++) {
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
  if (!!object['category']) {
    const temp = object['category'];
    delete object['category'];

    object = { category: temp, ...object };
  }
  return object;
};
