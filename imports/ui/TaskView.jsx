import React, { useState } from 'react';
import { useTracker } from 'meteor/react-meteor-data';
import { TasksCollection } from '/imports/db/TasksCollection';
import { Task } from './Task.jsx';
import { TaskForm } from './TaskForm';
import '/imports/api/tasksMethods';

const toggleChecked = ({ _id, isChecked }) => Meteor.call('tasks.setIsChecked', _id, !isChecked);

const deleteTask = ({ _id }) => Meteor.call('tasks.remove', _id);

export const TaskView = () => {
    const user = useTracker(() => Meteor.user());
    const userName = user.username || user.profile.name;

    const [hideCompleted, setHideCompleted] = useState(false);

    const hideCompletedFilter = { isChecked: { $ne: true } };
  
    const userFilter = user ? { userId: user._id } : {};
  

  
    const pendingOnlyFilter = { ...hideCompletedFilter, ...userFilter };
  
    const { tasks, pendingTasksCount, isLoading } = useTracker(() => {
  
      const noDataAvailable = { tasks: [], pendingTasksCount: 0 };
      if (!Meteor.user()) {
        return noDataAvailable;
      }
      const handler = Meteor.subscribe('tasks');
  
      if (!handler.ready()) {
        return { ...noDataAvailable, isLoading: true };
      }
  
      const tasks = TasksCollection.find(
        hideCompleted ? pendingOnlyFilter : userFilter,
        {
          sort: { createdAt: -1 },
        }
      ).fetch();
      const pendingTasksCount = TasksCollection.find(pendingOnlyFilter).count();
  
      return { tasks, pendingTasksCount };
    });
    const pendingTasksTitle = `${pendingTasksCount ? ` (${pendingTasksCount})` : ''
      }`;
  
    const logout = () => Meteor.logout();
  
    return (
    <><header>
            <div className="app-bar">
                <div className="app-header">
                    <h1>
                        📝️ To Do List
                        {pendingTasksTitle}
                    </h1>
                </div>
            </div>
        </header><div className="user" onClick={logout}>
             {userName} 🚪 
        
            </div><TaskForm user={user} /><div className="filter">
                <button onClick={() => setHideCompleted(!hideCompleted)}>
                    {hideCompleted ? 'Show All' : 'Hide Completed'}
                </button>
            </div>
  { isLoading && <div className="loading">loading...</div> }

    <ul className="tasks">
        {tasks.map(task => (
            <Task
                key={task._id}
                task={task}
                onCheckboxClick={toggleChecked}
                onDeleteClick={deleteTask} />
        ))}
    </ul>
    </>

  );
};