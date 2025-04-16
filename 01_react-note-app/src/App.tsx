import { Navigate, Route, Routes } from 'react-router';
import { NewNote } from './pages/NewNote';

function App() {
  return (
    <div className='w-full my-4 px-4 '>
      <Routes>
        <Route path='/' element={<h1>Hi</h1>} />
        <Route path='/new' element={<NewNote />} />
        <Route path='/:id'>
          <Route index element={<h1>Show</h1>} />
          <Route path='edit' element={<h1>Edit</h1>} />
        </Route>
        <Route path='*' element={<Navigate to='/' />} />
      </Routes>
    </div>
  );
}

export default App;
