// src/api.ts
const BASE_URL = process.env.EXPO_PUBLIC_API_URL; // Replace with your actual IP
console.log(`my url is ${BASE_URL}`);

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
export const getProjects = (userId: string) =>
  request(`/get_projects?userID=${userId}`);

export const createProject = (title: string, description: string, ownerId: string, memberId: string) =>
  request('/create_project', 'POST', { title, description, ownerID: ownerId, members: [memberId] });

// ─────────── Tasks ───────────
export const getTasks = (projectId: string) =>
  request(`/get_tasks?projectID=${projectId}`);

export const createTask = (
  projectId: string,
  title: string,
  description: string,
  deadline: string,
  priority: string,
  assignedTo: string
) =>
  request('/create_task', 'POST', {
    title,
    description,
    dueDate: deadline,
    priority,
    assignedTo,
    projectID: projectId,
  });

export const updateTask = (
  taskId: string,
  title: string,
  description: string,
  status: string,
  deadline: string,
  priority: string,
  assignedTo: string
) =>
  request(`/update_task/${taskId}`, 'PUT', {
    title,
    description,
    status,
    dueDate: deadline,
    priority,
    assignedUsername: assignedTo
  });

export const deleteTask = (taskId: string) =>
  request(`/delete_task/${taskId}`, 'DELETE');
  //———————————— Users ———————————
export const getUsers = () => request('/users', 'GET');

// ─────────── TaskList ───────────
export const getTaskList = (taskId: string) =>
  request(`/tasks/${taskId}/tasklist`);

export const createTaskListItem = (taskId: string, title: string, completed = false) =>
  request(`/tasks/${taskId}/tasklist`, 'POST', { title, completed });
