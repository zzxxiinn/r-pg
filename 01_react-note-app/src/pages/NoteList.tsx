import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { TagsSelector } from '@/components/ui/tags-selector';
import { Tag } from '@/shemas/note';
import { X } from 'lucide-react';
import { PropsWithChildren, useMemo, useState } from 'react';
import { Link } from 'react-router';

type SimplifiedNote = {
  tags: Tag[];
  title: string;
  id: string;
};

type NoteListProps = {
  availableTags: Tag[];
  notes: SimplifiedNote[];
  onUpdateTag: (id: string, label: string) => void;
  onDeleteTag: (id: string) => void;
};

export function NoteList({
  availableTags,
  notes,
  onUpdateTag,
  onDeleteTag,
}: NoteListProps) {
  const [title, setTitle] = useState('');
  const [selectedTags, setSelectedTags] = useState<Tag[]>([]);

  const filteredNotes = useMemo(() => {
    return notes.filter((note) => {
      return (
        (title === '' ||
          note.title.toLowerCase().includes(title.toLowerCase())) &&
        (selectedTags.length === 0 ||
          selectedTags.every((tag) =>
            note.tags.some((noteTag) => noteTag.id === tag.id)
          ))
      );
    });
  }, [title, selectedTags, notes]);

  return (
    <>
      <h1 className='w-full flex justify-between'>
        <span className=''>Notes</span>
        <div className='inline-flex gap-2'>
          <Link to='/new'>
            <Button>Create</Button>
          </Link>

          <EditTagsModal
            availableTags={availableTags}
            onDeleteTag={onDeleteTag}
            onUpdateTag={onUpdateTag}
          >
            <Button variant='secondary'>Edit Tags</Button>
          </EditTagsModal>
        </div>
      </h1>
      <div className='flex gap-2 w-full'>
        <div className='grid w-full max-w-sm items-center gap-1.5'>
          <Label htmlFor='title'>Title</Label>
          <Input
            id='title'
            placeholder='shadcn'
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div className='grid w-full max-w-sm items-center gap-1.5'>
          <Label htmlFor='tags'>Tags</Label>
          <TagsSelector
            id='tags'
            selected={selectedTags}
            onSelectChange={(value) => {
              setSelectedTags(
                value.map((tag) => ({ id: tag.id, label: tag.label }))
              );
            }}
            options={availableTags}
          />
        </div>
      </div>
      <section className='my-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
        {filteredNotes.map((note) => (
          <NoteCard
            key={note.id}
            id={note.id}
            title={note.title}
            tags={note.tags}
          />
        ))}
      </section>
    </>
  );
}

function NoteCard({ id, title, tags }: SimplifiedNote) {
  return (
    <Link to={`/note/${id}`}>
      <Card id={id} className='transition-shadow shadow-none hover:shadow-sm'>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription className='flex gap-2 mt-1'>
            {tags.map(({ id, label }) => (
              <Badge key={id} variant='secondary'>
                {label}
              </Badge>
            ))}
          </CardDescription>
        </CardHeader>
      </Card>
    </Link>
  );
}

type EditTagsModalProps = {
  availableTags: Tag[];
  onDeleteTag: (id: string) => void;
  onUpdateTag: (id: string, label: string) => void;
};

function EditTagsModal({
  children,
  availableTags,
  onDeleteTag,
  onUpdateTag,
}: PropsWithChildren<EditTagsModalProps>) {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className='sm:max-w-[425px] max-h-[600px] flex flex-col'>
        <DialogHeader className='mb-2 shrink-0'>
          <DialogTitle>Edit Tags</DialogTitle>
          <DialogDescription>
            Make changes to your profile here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <div className='grid gap-4 h-full -mx-2'>
          {availableTags.length && (
            <ScrollArea className='h-96 w-full'>
              {availableTags.map((tag) => (
                <div
                  className='flex justify-center gap-4 my-2 px-2'
                  key={tag.id}
                >
                  <Input
                    id='name'
                    value={tag.label}
                    className='w-full'
                    onChange={(e) => onUpdateTag(tag.id, e.target.value)}
                  />
                  <Button
                    variant='destructive'
                    size='icon'
                    className='shrink-0'
                    onClick={() => onDeleteTag(tag.id)}
                  >
                    <X />
                  </Button>
                </div>
              ))}
            </ScrollArea>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
