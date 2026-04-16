import { apiRequest } from './api';

export function getTasks() {
  return apiRequest('/tasks', {
    method: 'GET'
  });
}

export function createTask(payload) {
  return apiRequest('/tasks', {
    method: 'POST',
    body: JSON.stringify(payload)
  });
}

export function updateTask(id, payload) {
  return apiRequest(`/tasks/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload)
  });
}

export function deleteTask(id) {
  return apiRequest(`/tasks/${id}`, {
    method: 'DELETE'
  });
}
