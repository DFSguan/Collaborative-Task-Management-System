export type RootStackParamList = {
  Welcome: undefined;
  Login: undefined;
  SignUp: undefined;
  Project: undefined;
  Main: undefined;
  TaskList: { projectId: string; projectTitle: string };
  AddTask: { projectID: string };
  TaskDetail: {
    taskID: string;
    title: string;
    description: string;
    priority: string;
    dueDate: string;
    assignedTo: string;
    status: string;
  };
};

export interface User {
  userID: string;
  username: string;
}

export interface Project {
  projectID: string;
  title: string;
  description: string;
}

export type Task = {
  taskID: string;
  projectID: string;
  description: string;
  title: string;
  dueDate: string;
  status: string;
  assignedUsername: string;
  priority: string;
};