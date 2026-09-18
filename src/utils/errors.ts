import axios from 'axios';

/** True when `error` is an HTTP 404 from the API (as opposed to a network/5xx failure). */
export function isNotFoundError(error: unknown): boolean {
  return axios.isAxiosError(error) && error.response?.status === 404;
}
