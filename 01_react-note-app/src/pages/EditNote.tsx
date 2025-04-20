import { NoteForm } from '@/components/NoteForm';
import { NoteData, Tag } from '@/shemas/note';
import { useNote } from '../components/NoteLayout';

type EditNoteProps = {
  onSubmit: (id: string, data: NoteData) => void;
  onAddTag: (tag: Tag) => void;
  availableTags: Tag[];
};

export function EditNote({ onSubmit, onAddTag, availableTags }: EditNoteProps) {
  const note = useNote();

  return (
    <>
      <header>
        <h1 className='flex w-full text-3xl my-4'>Edit Note</h1>
      </header>

      <NoteForm
        title={note.title}
        markdown={note.markdown}
        tags={note.tags}
        onSubmit={(data) => onSubmit(note.id, data)}
        onAddTag={onAddTag}
        availableTags={availableTags}
      />
    </>
  );
}
