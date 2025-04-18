import { Note } from '@/shemas/note';
import { Navigate, useParams } from 'react-router';

type NoteLayoutProps = {
  notes: Note[];
};

export function NoteLayout({ notes }: NoteLayoutProps) {
  const { id } = useParams();
  const note = notes.find((n) => n.id === id);

  if (!note) return <Navigate to='/' replace />;

  return <></>;
}
