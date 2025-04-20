// src/api.ts

const BASE_URL = 'http://192.168.245.174:3000'; // Replace with your actual IP

const request = async (endpoint: string, method = 'GET', body?: any) => {
  const config: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
  };

  if (body) {
    config.body = JSON.stringify(body);
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, config);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Something went wrong');
  }

  return data;
};

// ─────────── Auth ───────────
export const loginUser = (email: string, password: string) =>
  request('/login', 'POST', { email, password });

export const signUpUser = (email: string, password: string, name: string) =>
  request('/signup', 'POST', { email, password, name });

// ─────────── Projects ───────────
export const getProjects = () =>
  request('/projects');

export const createProject = (title: string, description: string, ownerId: string, memberId: string) =>
  request('/create_project', 'POST', { title, description, ownerID: ownerId, members: [memberId] });

// ─────────── Tasks ───────────
export const getTasks = (projectId: string) =>
  request(`/projects/${projectId}/tasks`);

export const createTask = (projectId: string, title: string, deadline: string) =>
  request(`/projects/${projectId}/tasks`, 'POST', { title, deadline });

// ─────────── TaskList ───────────
export const getTaskList = (taskId: string) =>
  request(`/tasks/${taskId}/tasklist`);

export const createTaskListItem = (taskId: string, title: string, completed = false) =>
  request(`/tasks/${taskId}/tasklist`, 'POST', { title, completed });
