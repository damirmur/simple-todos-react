import React from 'react';

export const Task = ({ task, onCheckboxClick, onDeleteClick }) => {
  const className = task.isChecked ? ('taskChecked') : ('taskNotChecked');
  return (
    
    <li>
      <input
        type="checkbox"
        checked={!!task.isChecked}
        onClick={() => onCheckboxClick(task)}
        readOnly
      />
      <span className={className}>{task.text}</span>
      <button onClick={ () => onDeleteClick(task) }>&times;</button>
    </li>
  );
};