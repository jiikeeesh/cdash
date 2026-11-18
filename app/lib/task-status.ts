import { prisma } from './db';

/**
 * Returns the busyness status of an active task for the given user right now.
 * - An all-day task is active throughout its scheduled day.
 * - A timed task is active within its scheduled time window (start time to 1 hour later, or if in-progress).
 * Returns null if no active scheduled task is currently in effect.
 */
export async function getActiveTaskBusynessForUser(userId: string): Promise<string | null> {
  if (!userId) return null;
  try {
    const now = new Date();
    // Query tasks where the user is an assignee and task is not done
    const tasks = await prisma.task.findMany({
      where: {
        assignees: { some: { id: userId } },
        status: { notIn: ['done'] },
      },
      select: {
        id: true,
        dueDate: true,
        busyness: true,
        status: true,
      },
      orderBy: { updatedAt: 'desc' },
    });

    for (const task of tasks) {
      if (!task.dueDate) continue;
      const taskDate = new Date(task.dueDate);
      if (isNaN(taskDate.getTime())) continue;

      const isAllDay = taskDate.getHours() === 0 && taskDate.getMinutes() === 0;
      if (isAllDay) {
        const isSameDay =
          now.getFullYear() === taskDate.getFullYear() &&
          now.getMonth() === taskDate.getMonth() &&
          now.getDate() === taskDate.getDate();

        if (isSameDay && task.busyness) {
          return task.busyness;
        }
      } else {
        const startMs = taskDate.getTime();
        // Standard meeting/event window is 1 hour from start
        const endMs = startMs + 60 * 60 * 1000;
        const nowMs = now.getTime();

        if ((nowMs >= startMs && nowMs <= endMs) || (task.status === 'in-progress' && nowMs >= startMs)) {
          if (task.busyness) {
            return task.busyness;
          }
        }
      }
    }
    return null;
  } catch (err) {
    console.error('Error checking active task busyness:', err);
    return null;
  }
}
