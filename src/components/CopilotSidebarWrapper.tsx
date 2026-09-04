'use client';

import React from 'react';
import { CopilotSidebar } from '@copilotkit/react-ui';
import '@copilotkit/react-ui/styles.css';

export default function CopilotSidebarWrapper() {
  return (
    <CopilotSidebar
      instructions={
        'You are TaskFlow AI, an intelligent personal task manager. ' +
        'You can add tasks with date/time, update tasks, mark tasks complete or incomplete, delete tasks, ' +
        'reschedule overdue tasks, and filter or search tasks. ' +
        'Always use the provided actions (addTask, updateTask, deleteTask, setTaskCompletion, rescheduleTask, filterTasks, clearCompletedTasks) to modify the state directly.'
      }
      labels={{
        title: 'TaskFlow AI Assistant',
        initial: 'Hi! I am your AI Task Manager. You can ask me to:\n• "Add a task: Review sprint items tomorrow at 11 AM"\n• "What tasks are overdue?"\n• "Reschedule all overdue tasks to tomorrow morning"\n• "Mark the meeting task as completed"',
      }}
      defaultOpen={false}
      clickOutsideToClose={true}
    />
  );
}

