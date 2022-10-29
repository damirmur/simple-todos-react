import { Meteor } from 'meteor/meteor';
import React from 'react';
import { useTracker } from 'meteor/react-meteor-data';
import { TaskView } from './TaskView';
import { LoginForm } from './LoginForm';

export const App = () => {
  const user = useTracker(() => Meteor.user());

  return (
    <div className="app">
      <div className="main">
        {user ? (
          <TaskView/>
        ) : (
          <LoginForm />
        )}
      </div>
    </div>
  );
};
