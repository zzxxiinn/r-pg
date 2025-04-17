import { NoteForm } from '@/components/NoteForm';
import { NoteData } from '@/shemas/note';

type NewNoteProps = {
  onSubmit: (datat: NoteData) => void;
};

export function NewNote({ onSubmit }: NewNoteProps) {
  return (
    <>
      <h1 className='flex w-full'>New Note</h1>
      <NoteForm onSubmit={onSubmit} />
    </>
  );
}
