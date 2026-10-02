'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth, type SafeUser } from '../../lib/auth-context';

type TaskStatus   = 'pending' | 'in-progress' | 'review' | 'done';
type TaskPriority = 'low' | 'medium' | 'high' | 'critical';

interface Task {
  id: string; title: string; description: string;
  assignedToId: string; assignedById: string;
  status: TaskStatus; priority: TaskPriority;
  dueDate: string; createdAt: string; updatedAt: string; notes: string[];
}

const STATUS_OPTIONS: TaskStatus[]     = ['pending', 'in-progress', 'review', 'done'];
const PRIORITY_OPTIONS: TaskPriority[] = ['low', 'medium', 'high', 'critical'];

// ── Toast ──────────────────────────────────────────────────────────────────
type ToastType = 'success' | 'error' | 'info';
interface ToastMsg { id: number; type: ToastType; text: string; }
function useToast() {
  const [toasts, setToasts] = useState<ToastMsg[]>([]);
  const push = useCallback((type: ToastType, text: string) => {
    const id = Date.now();
    setToasts((p) => [...p, { id, type, text }]);
    setTimeout(() => setToasts((p) => p.filter((t) => t.id !== id)), 3500);
  }, []);
  return { toasts, push };
}

// ── Task Form Modal ────────────────────────────────────────────────────────
function TaskModal({ task, users, currentUserId, canAssign, onClose, onSave }: {
  task: Task | null; users: SafeUser[]; currentUserId: string;
  canAssign: boolean; onClose: () => void;
  onSave: (data: Record<string, string>) => void;
}) {
  const defaultDue = new Date(Date.now() + 7 * 864e5).toISOString().slice(0, 10);
  const [form, setForm] = useState({
    title: task?.title ?? '',
    description: task?.description ?? '',
    assignedToId: task?.assignedToId ?? '',
    priority: task?.priority ?? 'medium',
    status: task?.status ?? 'pending',
    dueDate: task ? task.dueDate.slice(0, 10) : defaultDue,
  });
  const setF = (k: string, v: string) => setForm((p) => ({ ...p, [k]: v }));
  const assignable = users.filter((u) => u.role === 'user');

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="modal-title">{task ? 'Edit Task' : 'Create Task'}</h3>
          <button className="btn-close" onClick={onClose}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>
        </div>
        <div className="modal-body">
          <div className="field"><label className="label">Task Title *</label>
            <input className="input" value={form.title} onChange={(e) => setF('title', e.target.value)} placeholder="Enter task title" /></div>
          <div className="field"><label className="label">Description</label>
            <textarea className="textarea" value={form.description} onChange={(e) => setF('description', e.target.value)} rows={3} placeholder="Describe the task…" /></div>
          <div className="field-row">
            <div className="field"><label className="label">Assign To *</label>
              <select className="select" value={form.assignedToId} onChange={(e) => setF('assignedToId', e.target.value)} disabled={!canAssign}>
                <option value="">Select user…</option>
                {assignable.map((u) => <option key={u.id} value={u.id}>{u.fullName}</option>)}
              </select></div>
            <div className="field"><label className="label">Due Date *</label>
              <input className="input" type="date" value={form.dueDate} onChange={(e) => setF('dueDate', e.target.value)} /></div>
          </div>
          <div className="field-row">
            <div className="field"><label className="label">Priority</label>
              <select className="select" value={form.priority} onChange={(e) => setF('priority', e.target.value)}>
                {PRIORITY_OPTIONS.map((p) => <option key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</option>)}</select></div>
            <div className="field"><label className="label">Status</label>
              <select className="select" value={form.status} onChange={(e) => setF('status', e.target.value)}>
                {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s.replace('-', ' ')}</option>)}</select></div>
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn btn-outline" onClick={onClose}>Cancel</button>
          <button className="btn btn-brand" onClick={() => {
            if (!form.title.trim() || !form.assignedToId || !form.dueDate) return;
            onSave(form);
          }}>{task ? 'Save Changes' : 'Create Task'}</button>
        </div>
      </div>
    </div>
  );
}

// ── Status Update Modal ────────────────────────────────────────────────────
function UpdateStatusModal({ task, onClose, onSave }: {
  task: Task; onClose: () => void;
  onSave: (status: TaskStatus, note: string) => void;
}) {
  const [status, setStatus] = useState<TaskStatus>(task.status);
  const [note, setNote]     = useState('');
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" style={{ maxWidth: 420 }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="modal-title">Update Task Status</h3>
          <button className="btn-close" onClick={onClose}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>
        </div>
        <div className="modal-body">
          <p style={{ fontSize: 14, color: 'var(--neutral-600)', marginBottom: 16 }}><strong>{task.title}</strong></p>
          <div className="field"><label className="label">New Status</label>
            <select className="select" value={status} onChange={(e) => setStatus(e.target.value as TaskStatus)}>
              {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s.replace('-', ' ')}</option>)}</select></div>
          <div className="field"><label className="label">Note (optional)</label>
            <textarea className="textarea" value={note} onChange={(e) => setNote(e.target.value)} rows={3} placeholder="Add a progress note…" /></div>
        </div>
        <div className="modal-footer">
          <button className="btn btn-outline" onClick={onClose}>Cancel</button>
          <button className="btn btn-brand" onClick={() => onSave(status, note)}>Update</button>
        </div>
      </div>
    </div>
  );
}

// ── Task Detail Modal ──────────────────────────────────────────────────────
function TaskDetailModal({ task, users, onClose }: { task: Task; users: SafeUser[]; onClose: () => void }) {
  const assignee = users.find((u) => u.id === task.assignedToId);
  const assigner = users.find((u) => u.id === task.assignedById);
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" style={{ maxWidth: 560 }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="modal-title">{task.title}</h3>
          <button className="btn-close" onClick={onClose}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>
        </div>
        <div className="modal-body">
          <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
            <span className={`badge badge-${task.status}`}>{task.status.replace('-', ' ')}</span>
            <span className={`badge badge-${task.priority}`}>{task.priority}</span>
          </div>
          {task.description && <p style={{ fontSize: 14, color: 'var(--neutral-600)', marginBottom: 20, lineHeight: 1.7 }}>{task.description}</p>}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
            {[
              ['Assigned To', assignee?.fullName ?? '—'],
              ['Assigned By', assigner?.fullName ?? '—'],
              ['Due Date', new Date(task.dueDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })],
              ['Created', new Date(task.createdAt).toLocaleDateString()],
            ].map(([label, val]) => (
              <div key={label}>
                <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--neutral-400)', textTransform: 'uppercase', letterSpacing: '.5px', marginBottom: 4 }}>{label}</div>
                <div style={{ fontSize: 14, color: 'var(--neutral-800)', fontWeight: 500 }}>{val}</div>
              </div>
            ))}
          </div>
          {task.notes.length > 0 && (<>
            <div className="divider" />
            <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--neutral-700)', marginBottom: 10 }}>Progress Notes</div>
            {task.notes.map((n, i) => (
              <div key={i} style={{ background: 'var(--neutral-50)', border: '1px solid var(--neutral-200)', borderRadius: 'var(--radius-md)', padding: '10px 14px', marginBottom: 8, fontSize: 13, color: 'var(--neutral-700)' }}>{n}</div>
            ))}
          </>)}
        </div>
        <div className="modal-footer"><button className="btn btn-outline" onClick={onClose}>Close</button></div>
      </div>
    </div>
  );
}

// ── Main Page ──────────────────────────────────────────────────────────────
export default function TasksPage() {
  const { currentUser } = useAuth();
  const { toasts, push } = useToast();
  const [tasks, setTasks]   = useState<Task[]>([]);
  const [users, setUsers]   = useState<SafeUser[]>([]);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus]     = useState<TaskStatus | 'all'>('all');
  const [filterPriority, setFilterPriority] = useState<TaskPriority | 'all'>('all');
  const [view, setView]     = useState<'list' | 'grid'>('list');
  const [modalState, setModalState] = useState<
    | { type: 'create' } | { type: 'edit'; task: Task }
    | { type: 'detail'; task: Task } | { type: 'status'; task: Task } | null
  >(null);

  const loadTasks = useCallback(() => {
    if (!currentUser) return;
    const url = currentUser.role === 'user' ? `/api/tasks?userId=${currentUser.id}` : '/api/tasks';
    fetch(url).then((r) => r.json()).then(setTasks).catch(() => {});
  }, [currentUser]);

  useEffect(() => {
    if (!currentUser) return;
    loadTasks();
    fetch('/api/users').then((r) => r.json()).then(setUsers).catch(() => {});
  }, [currentUser, loadTasks]);

  if (!currentUser) return null;

  const canAssign = currentUser.role !== 'user';
  const isAdmin   = currentUser.role === 'admin';

  const filtered = tasks.filter((t) => {
    const q = search.toLowerCase();
    return (!q || t.title.toLowerCase().includes(q) || t.description.toLowerCase().includes(q))
      && (filterStatus === 'all' || t.status === filterStatus)
      && (filterPriority === 'all' || t.priority === filterPriority);
  });

  const getUserName = (id: string) => users.find((u) => u.id === id)?.fullName ?? '—';

  async function handleSave(form: Record<string, string> & { id?: string }) {
    const isEdit = !!(modalState as any)?.task;
    const taskId = (modalState as any)?.task?.id;
    const body = {
      title: form.title, description: form.description,
      assignedToId: form.assignedToId, priority: form.priority,
      status: form.status, dueDate: new Date(form.dueDate).toISOString(),
      ...(!isEdit && { assignedById: currentUser.id }),
    };
    const res = isEdit
      ? await fetch(`/api/tasks/${taskId}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
      : await fetch('/api/tasks', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    if (res.ok) { push('success', isEdit ? 'Task updated' : 'Task created'); loadTasks(); setModalState(null); }
    else { const d = await res.json(); push('error', d.error ?? 'Failed'); }
  }

  async function handleStatusUpdate(task: Task, status: TaskStatus, note: string) {
    const notes = note.trim()
      ? [...task.notes, `[${new Date().toLocaleDateString()}] ${note.trim()}`]
      : task.notes;
    const res = await fetch(`/api/tasks/${task.id}`, {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, notes }),
    });
    if (res.ok) { push('success', 'Status updated'); loadTasks(); setModalState(null); }
    else push('error', 'Failed to update status');
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this task?')) return;
    const res = await fetch(`/api/tasks/${id}`, { method: 'DELETE' });
    if (res.ok) { push('info', 'Task deleted'); loadTasks(); }
    else push('error', 'Failed to delete');
  }

  return (
    <>
      <div className="toast-container">{toasts.map((t) => <div key={t.id} className={`toast toast-${t.type}`}>{t.text}</div>)}</div>

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 style={{ fontSize: 20, fontWeight: 700, color: 'var(--neutral-900)' }}>{currentUser.role === 'user' ? 'My Tasks' : 'Task Management'}</h2>
          <p className="text-sm text-neutral" style={{ marginTop: 2 }}>{filtered.length} task{filtered.length !== 1 ? 's' : ''} found</p>
        </div>
        <div className="flex items-center gap-2">
          <div style={{ display: 'flex', border: '1.5px solid var(--neutral-200)', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
            {(['list', 'grid'] as const).map((v) => (
              <button key={v} onClick={() => setView(v)} style={{ padding: '7px 12px', border: 'none', background: view === v ? 'var(--brand-600)' : 'white', color: view === v ? 'white' : 'var(--neutral-500)', cursor: 'pointer', transition: 'all .2s' }}>
                {v === 'list'
                  ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>
                  : <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>}
              </button>
            ))}
          </div>
          {canAssign && (
            <button id="create-task-btn" className="btn btn-brand" onClick={() => setModalState({ type: 'create' })}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
              Assign Task
            </button>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="filter-row">
        <div className="search-bar" style={{ flex: 1, maxWidth: 320 }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: 'var(--neutral-400)', flexShrink: 0 }}><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
          <input placeholder="Search tasks…" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <select className="select" style={{ width: 'auto' }} value={filterStatus} onChange={(e) => setFilterStatus(e.target.value as any)}>
          <option value="all">All Statuses</option>
          {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s.replace('-', ' ')}</option>)}
        </select>
        <select className="select" style={{ width: 'auto' }} value={filterPriority} onChange={(e) => setFilterPriority(e.target.value as any)}>
          <option value="all">All Priorities</option>
          {PRIORITY_OPTIONS.map((p) => <option key={p} value={p}>{p}</option>)}
        </select>
      </div>

      {/* Task list */}
      {filtered.length === 0 ? (
        <div className="card"><div className="empty-state"><div className="empty-state-icon">📋</div><h3>No tasks found</h3><p>{canAssign ? 'Click "Assign Task" to create one.' : 'No tasks assigned to you yet.'}</p></div></div>
      ) : view === 'grid' ? (
        <div className="task-grid">
          {filtered.map((task) => (
            <div key={task.id} className={`task-card priority-${task.priority}`} onClick={() => setModalState({ type: 'detail', task })}>
              <div className="task-card-header">
                <div className="task-card-title">{task.title}</div>
                <span className={`badge badge-${task.status}`} style={{ flexShrink: 0, fontSize: 11 }}>{task.status.replace('-', ' ')}</span>
              </div>
              <div className="task-card-desc">{task.description || 'No description.'}</div>
              <div className="task-card-meta">
                <div className="task-card-assignee">
                  <div className="mini-avatar">{getUserName(task.assignedToId).slice(0, 2).toUpperCase()}</div>
                  <span>{getUserName(task.assignedToId)}</span>
                </div>
                <span>Due {new Date(task.dueDate).toLocaleDateString()}</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="card">
          <div className="table-wrap">
            <table>
              <thead><tr>
                <th>Task</th><th>Assigned To</th>
                {canAssign && <th>Assigned By</th>}
                <th>Priority</th><th>Status</th><th>Due Date</th><th>Actions</th>
              </tr></thead>
              <tbody>
                {filtered.map((task) => (
                  <tr key={task.id}>
                    <td>
                      <div style={{ fontWeight: 600, color: 'var(--neutral-900)' }}>{task.title}</div>
                      {task.description && <div style={{ fontSize: 12, color: 'var(--neutral-400)', marginTop: 2, maxWidth: 260, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{task.description}</div>}
                    </td>
                    <td>{getUserName(task.assignedToId)}</td>
                    {canAssign && <td>{getUserName(task.assignedById)}</td>}
                    <td><span className={`badge badge-${task.priority}`}>{task.priority}</span></td>
                    <td><span className={`badge badge-${task.status}`}>{task.status.replace('-', ' ')}</span></td>
                    <td style={{ fontSize: 13, color: 'var(--neutral-500)' }}>{new Date(task.dueDate).toLocaleDateString()}</td>
                    <td>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <button className="btn btn-outline btn-sm" onClick={() => setModalState({ type: 'detail', task })} title="View">
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                        </button>
                        {!canAssign && (
                          <button className="btn btn-outline btn-sm" onClick={() => setModalState({ type: 'status', task })} title="Update status">
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>
                          </button>
                        )}
                        {canAssign && (
                          <button className="btn btn-outline btn-sm" onClick={() => setModalState({ type: 'edit', task })} title="Edit">
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                          </button>
                        )}
                        {isAdmin && (
                          <button className="btn btn-danger btn-sm" onClick={() => handleDelete(task.id)} title="Delete">
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/></svg>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modals */}
      {(modalState?.type === 'create' || modalState?.type === 'edit') && (
        <TaskModal task={modalState.type === 'edit' ? modalState.task : null} users={users}
          currentUserId={currentUser.id} canAssign={canAssign}
          onClose={() => setModalState(null)} onSave={handleSave} />
      )}
      {modalState?.type === 'detail' && <TaskDetailModal task={modalState.task} users={users} onClose={() => setModalState(null)} />}
      {modalState?.type === 'status' && (
        <UpdateStatusModal task={modalState.task} onClose={() => setModalState(null)}
          onSave={(status, note) => handleStatusUpdate(modalState.task, status, note)} />
      )}
    </>
  );
}
