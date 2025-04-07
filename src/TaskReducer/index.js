import AddTask from './AddTask.js';
import TaskList from './TaskList.js';
import tasksReducer from './tasksReducer';
import { useEffect, useReducer } from 'react';

export default function TaskReducer() {
  const [tasks, dispatch] = useReducer(tasksReducer, initialTasks);

  useEffect(() => {
    console.log('TaskReducer useEffect');
  }, [tasks]);

  console.log('init', tasks);

  function handleAddTask(text) {
    dispatch({ type: 'added', id: nextId++, text: text });

    console.log('handleAddTask -> ', tasks);
  }

  function handleChangeTask(task) {
    dispatch({ type: 'changed', task: task });
  }

  function handleDeleteTask(taskId) {
    dispatch({ type: 'deleted', id: taskId });
  }

  return (
    <>
      <h1>布拉格的行程安排</h1>
      <AddTask onAddTask={handleAddTask} />
      <TaskList
        tasks={tasks}
        onChangeTask={handleChangeTask}
        onDeleteTask={handleDeleteTask}
      />
    </>
  );
}

let nextId = 3;
const initialTasks = [
  { id: 0, text: '参观卡夫卡博物馆', done: true },
  { id: 1, text: '看木偶戏', done: false },
  { id: 2, text: '打卡列侬墙', done: false }
];
