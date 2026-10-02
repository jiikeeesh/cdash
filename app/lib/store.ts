// In-memory + localStorage store for the dashboard
// Acts as a lightweight mock database

export type Role = 'admin' | 'moderator' | 'user';

export type TaskStatus = 'pending' | 'in-progress' | 'review' | 'done';
export type TaskPriority = 'low' | 'medium' | 'high' | 'critical';

export interface User {
  id: string;
  username: string;
  password: string;
  role: Role;
  fullName: string;
  email: string;
  department: string;
  isFirstLogin: boolean;
  createdAt: string;
  createdBy: string;
  avatar?: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  assignedTo: string; // userId
  assignedBy: string; // userId
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: string;
  createdAt: string;
  updatedAt: string;
  notes: string[];
  attachments?: string[];
}

export interface AccountRequest {
  id: string;
  requestedBy: string; // moderator userId
  requestedRole: 'user';
  fullName: string;
  email: string;
  department: string;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  resolvedAt?: string;
  resolvedBy?: string;
}

const USERS_KEY    = 'cdash_users';
const TASKS_KEY    = 'cdash_tasks';
const REQUESTS_KEY = 'cdash_requests';
// Bump this string whenever the seed changes to force a fresh localStorage init
const SEED_VERSION = 'v2-jiikeeesh';
const SEED_VER_KEY = 'cdash_seed_version';

// ── Seed data ──────────────────────────────────────────────────────────────

const seedUsers: User[] = [
  {
    id: 'usr_admin_jiikeeesh',
    username: 'jiikeeesh',
    password: 'J!kesh9803',
    role: 'admin',
    fullName: 'System Administrator',
    email: 'admin@company.com',
    department: 'IT',
    isFirstLogin: false,
    createdAt: new Date('2025-01-01').toISOString(),
    createdBy: 'system',
  },
];

function isBrowser() {
  return typeof window !== 'undefined';
}

// ── User helpers ───────────────────────────────────────────────────────────

/** Wipe localStorage and re-seed if the seed version has changed. */
function ensureSeedVersion(): void {
  if (!isBrowser()) return;
  const stored = localStorage.getItem(SEED_VER_KEY);
  if (stored !== SEED_VERSION) {
    // Seed changed — clear everything and start fresh
    localStorage.removeItem(USERS_KEY);
    localStorage.removeItem(TASKS_KEY);
    localStorage.removeItem(REQUESTS_KEY);
    localStorage.setItem(SEED_VER_KEY, SEED_VERSION);
  }
}

export function getUsers(): User[] {
  if (!isBrowser()) return seedUsers;
  ensureSeedVersion();
  const raw = localStorage.getItem(USERS_KEY);
  if (!raw) {
    localStorage.setItem(USERS_KEY, JSON.stringify(seedUsers));
    return seedUsers;
  }
  return JSON.parse(raw) as User[];
}

export function saveUsers(users: User[]): void {
  if (!isBrowser()) return;
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export function getUserById(id: string): User | undefined {
  return getUsers().find((u) => u.id === id);
}

export function getUserByUsername(username: string): User | undefined {
  return getUsers().find((u) => u.username.toLowerCase() === username.toLowerCase());
}

export function createUser(data: Omit<User, 'id' | 'createdAt'>): User {
  const users = getUsers();
  // Enforce username uniqueness before inserting
  if (users.some((u) => u.username.toLowerCase() === data.username.toLowerCase())) {
    throw new Error(`Username "${data.username}" is already taken.`);
  }
  // crypto.randomUUID() is available in all modern browsers & Node 19+
  const uid = typeof crypto !== 'undefined' && crypto.randomUUID
    ? crypto.randomUUID()
    : `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 9)}-${Math.random().toString(36).slice(2, 9)}`;
  const newUser: User = {
    ...data,
    id: `usr_${uid}`,
    createdAt: new Date().toISOString(),
  };
  users.push(newUser);
  saveUsers(users);
  return newUser;
}

export function updateUser(id: string, updates: Partial<User>): User | null {
  const users = getUsers();
  const idx = users.findIndex((u) => u.id === id);
  if (idx === -1) return null;
  users[idx] = { ...users[idx], ...updates };
  saveUsers(users);
  return users[idx];
}

export function deleteUser(id: string): boolean {
  const users = getUsers();
  const filtered = users.filter((u) => u.id !== id);
  if (filtered.length === users.length) return false;
  saveUsers(filtered);
  return true;
}

// ── Task helpers ───────────────────────────────────────────────────────────

export function getTasks(): Task[] {
  if (!isBrowser()) return [];
  const raw = localStorage.getItem(TASKS_KEY);
  return raw ? (JSON.parse(raw) as Task[]) : [];
}

export function saveTasks(tasks: Task[]): void {
  if (!isBrowser()) return;
  localStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
}

export function getTasksForUser(userId: string): Task[] {
  return getTasks().filter((t) => t.assignedTo === userId);
}

export function createTask(data: Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'notes'>): Task {
  const tasks = getTasks();
  const newTask: Task = {
    ...data,
    id: `task_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    notes: [],
  };
  tasks.push(newTask);
  saveTasks(tasks);
  return newTask;
}

export function updateTask(id: string, updates: Partial<Task>): Task | null {
  const tasks = getTasks();
  const idx = tasks.findIndex((t) => t.id === id);
  if (idx === -1) return null;
  tasks[idx] = { ...tasks[idx], ...updates, updatedAt: new Date().toISOString() };
  saveTasks(tasks);
  return tasks[idx];
}

export function deleteTask(id: string): boolean {
  const tasks = getTasks();
  const filtered = tasks.filter((t) => t.id !== id);
  if (filtered.length === tasks.length) return false;
  saveTasks(filtered);
  return true;
}

// ── Account Request helpers ─────────────────────────────────────────────────

export function getRequests(): AccountRequest[] {
  if (!isBrowser()) return [];
  const raw = localStorage.getItem(REQUESTS_KEY);
  return raw ? (JSON.parse(raw) as AccountRequest[]) : [];
}

export function saveRequests(requests: AccountRequest[]): void {
  if (!isBrowser()) return;
  localStorage.setItem(REQUESTS_KEY, JSON.stringify(requests));
}

export function createRequest(data: Omit<AccountRequest, 'id' | 'createdAt' | 'status'>): AccountRequest {
  const requests = getRequests();
  const newReq: AccountRequest = {
    ...data,
    id: `req_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    createdAt: new Date().toISOString(),
    status: 'pending',
  };
  requests.push(newReq);
  saveRequests(requests);
  return newReq;
}

export function updateRequest(id: string, updates: Partial<AccountRequest>): AccountRequest | null {
  const requests = getRequests();
  const idx = requests.findIndex((r) => r.id === id);
  if (idx === -1) return null;
  requests[idx] = { ...requests[idx], ...updates };
  saveRequests(requests);
  return requests[idx];
}
