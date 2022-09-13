import axios from 'axios';
import { SESSION_STORAGE_KEYS } from '../Utility/constants';
import { Envs } from '../Utility/envs';

const jwt = sessionStorage?.length ? sessionStorage.getItem(SESSION_STORAGE_KEYS.JWT) : null;

export const baseURL = Envs.DATA_PRODUCT_API_BASEURL
  ? Envs.DATA_PRODUCT_API_BASEURL
  : `http://${window.location.hostname}:7184/api`;

const headers = {
  Accept: 'application/json',
  'Content-Type': 'application/json',
  Authorization: jwt,
};

export const server = axios.create({
  baseURL,
  headers,
});

export const hostServer = axios.create({
  baseURL: Envs.API_BASEURL ? Envs.API_BASEURL : `http://${window.location.hostname}:7171/api`,
  headers,
});