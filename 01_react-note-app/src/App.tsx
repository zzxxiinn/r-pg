import type { NoteData, RawNote, Tag } from './shemas/note';

import { Navigate, Route, Routes } from 'react-router';
import { NewNote } from './pages/NewNote';
import { useLocalStorage } from './lib/useLocalStorage';
import { useMemo } from 'react';
import { v4 as uuidV4 } from 'uuid';
import { NoteList } from './pages/NoteList';
import { NoteLayout } from './components/NoteLayout';
import { Note } from './pages/Note';
import { EditNote } from './pages/EditNote';

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

  function onUpdateNote(id: string, { tags, ...data }: NoteData) {
    setNotes((prevNotes) => {
      return prevNotes.map((note) => {
        if (note.id === id) {
          return {
            ...note,
            ...data,
            tagIds: tags.map((tag) => tag.id),
          };
        } else {
          return note;
        }
      });
    });
  }

  function onDeleteNote(id: string): void {
    setNotes((prevNotes) => {
      return prevNotes.filter((note) => note.id !== id);
    });
  }

  function addTag(tag: Tag) {
    setTags((prev) => [...prev, tag]);
  }

  function updateTag(id: string, label: string) {
    console.log('[app.tsx] update tag');
    setTags((prev) =>
      prev.map((tag) => {
        return tag.id === id ? { ...tag, label } : tag;
      })
    );
  }

  function deleteTag(id: string) {
    setTags((prev) => {
      return prev.filter((tag) => tag.id !== id);
    });
  }

  return (
    <div className='w-full my-4 px-4 '>
      <Routes>
        <Route
          path='/'
          element={
            <NoteList
              notes={notesWithTags}
              availableTags={tags}
              onUpdateTag={updateTag}
              onDeleteTag={deleteTag}
            />
          }
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
        <Route path='/note/:id' element={<NoteLayout notes={notesWithTags} />}>
          <Route index element={<Note onDelete={onDeleteNote} />} />
          <Route
            path='edit'
            element={
              <EditNote
                onSubmit={onUpdateNote}
                onAddTag={addTag}
                availableTags={tags}
              />
            }
          />
        </Route>
        <Route path='*' element={<Navigate to='/' />} />
      </Routes>
    </div>
  );
}

export default App;
