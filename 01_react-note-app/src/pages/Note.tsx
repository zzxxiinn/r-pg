import { useNote } from '@/components/NoteLayout';
import { Badge } from '../components/ui/badge';
import { Link, useNavigate } from 'react-router';
import { Button } from '../components/ui/button';
import Markdown from 'react-markdown';

type NoteProps = {
  onDelete: (id: string) => void;
};

export function Note({ onDelete }: NoteProps) {
  const note = useNote();
  const navigate = useNavigate();

  return (
    <>
      <header className='flex justify-between my-8'>
        <div className='inline-flex flex-col items-start'>
          <h1 className='text-3xl my-2'>{note.title}</h1>
          {note.tags.length && (
            <div className='inline-flex gap-1'>
              {note.tags.map(({ id, label }) => (
                <Badge key={id} variant='secondary'>
                  {label}
                </Badge>
              ))}
            </div>
          )}
        </div>
        <div className='inline-flex justify-end items-center gap-2'>
          <Button asChild variant='default'>
            <Link to={`/note/${note.id}/edit`}>Edit</Link>
          </Button>
          <Button
            variant='destructive'
            onClick={() => {
              onDelete(note.id);
              navigate('/');
            }}
          >
            Delete
          </Button>
          <Button asChild variant='secondary'>
            <Link to='/'>Back</Link>
          </Button>
        </div>
      </header>
      <Markdown>{note.markdown}</Markdown>
    </>
  );
}
