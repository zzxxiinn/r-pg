import { NoteForm } from '@/components/NoteForm';
import { NoteData, Tag } from '@/shemas/note';

type NewNoteProps = {
  onSubmit: (datat: NoteData) => void;
  onAddTag: (tag: Tag) => void;
  availableTags: Tag[];
};

export function NewNote({ onSubmit, onAddTag, availableTags }: NewNoteProps) {
  return (
    <>
      <h1 className='flex w-full'>New Note</h1>
      <NoteForm
        onSubmit={onSubmit}
        onAddTag={onAddTag}
        availableTags={availableTags}
      />
    </>
  );
}
