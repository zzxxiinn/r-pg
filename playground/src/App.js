import './App.css';

import { default as UsingContext } from './UsingContext';
import { default as RenderProps } from './RenderProps';
import ProfilePage from './ProfilePage';
import PostList from './PostList';
import TaskReducer from './TaskReducer';
import ThemeApp from './ThemeContext';
import LoginApp from './LoginContext';
import MultiContextApp from './MultiContext';
import ReducerContext from './ReducerContext';

export default function App() {
  return (
    <>
      <ReducerContext />
      <MultiContextApp />
      <LoginApp />
      <ThemeApp />
      <TaskReducer />
      <PostList />
      <ProfilePage />
      <UsingContext />
      <RenderProps />
    </>
  );
}
