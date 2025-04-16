import { NoteForm } from '@/components/NoteForm';

export function NewNote() {
  return (
    <>
      <h1 className='flex w-full'>New Note</h1>
      <NoteForm />
    </>
  );
}
