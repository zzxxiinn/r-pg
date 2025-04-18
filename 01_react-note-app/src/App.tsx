import { Navigate, Route, Routes } from 'react-router';
import { NewNote } from './pages/NewNote';
import { useLocalStorage } from './lib/useLocalStorage';
import { useMemo } from 'react';
import type { NoteData, RawNote, Tag } from './shemas/note';
import { v4 as uuidV4 } from 'uuid';
import { NoteList } from './pages/NoteList';

function App() {
  const [notes, setNotes] = useLocalStorage<RawNote[]>('NOTES', []);
  const [tags, setTags] = useLocalStorage<Tag[]>('TAGS', []);

  const notesWithTags = useMemo(() => {
    return notes.map((note) => {
      return {
        ...note,
        tags: tags.filter((tag) => note.tagIds.includes(tag.id)),
      };
    });
  }, [notes, tags]);

  function onCreateNote({ tags, ...data }: NoteData) {
    setNotes((prevNotes: RawNote[]) => {
      return [
        ...prevNotes,
        { ...data, id: uuidV4(), tagIds: tags.map((tag) => tag.id) },
      ];
    });
  }

  function addTag(tag: Tag) {
    setTags((prev) => [...prev, tag]);
  }

  return (
    <div className='w-full my-4 px-4 '>
      <Routes>
        <Route
          path='/'
          element={<NoteList notes={notesWithTags} availableTags={tags} />}
        />
        <Route
          path='/new'
          element={
            <NewNote
              onSubmit={onCreateNote}
              onAddTag={addTag}
              availableTags={tags}
            />
          }
        />
        <Route path='/note/:id'>
          <Route index element={<h1>Show</h1>} />
          <Route path='edit' element={<h1>Edit</h1>} />
        </Route>
        <Route path='*' element={<Navigate to='/' />} />
      </Routes>
    </div>
  );
}

export default App;
