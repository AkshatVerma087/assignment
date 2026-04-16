import { apiRequest } from './api';

export function getAllUsers() {
  return apiRequest('/admin/users', {
    method: 'GET'
  });
}
