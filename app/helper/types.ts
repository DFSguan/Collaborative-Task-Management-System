export type RootStackParamList = {
  Welcome: undefined;
  Login: undefined;
  SignUp: undefined;
  Home: undefined;
  AddProject: undefined;
  ProjectList: undefined;
  ProjectBoard: undefined;
  Profile: undefined;
  Notification: undefined;
  ProjectDetail: { projectId: string };
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

export type User = {
  userID: string;
  username: string;
  avatar: string;
}

export type MemberProfile = {
  userID: string;
  name: string;
  avatar: string;
};

export type Project = {
  projectID: string;
  title: string;
  description: string;
  deadline: string;
  ownerID: string;
  members: string[];
  memberProfiles?: MemberProfile[];
}

export type Task = {
  taskID: string;
  projectID: string;
  description: string;
  title: string;
  dueDate: string;
  status: string;
  assignedUsername: string;
  assignedAvatar: string;
  priority: string;
};