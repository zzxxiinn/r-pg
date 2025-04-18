import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { TagsSelector } from '@/components/ui/tags-selector';
import { Note, Tag, tagSchema } from '@/shemas/note';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router';
import { z } from 'zod';

type SimplifiedNote = {
  tags: Tag[];
  title: string;
  id: string;
};

type NoteListProps = {
  availableTags: Tag[];
  notes: Note[];
};

export function NoteList({ availableTags, notes }: NoteListProps) {
  const listForm = z.object({
    title: z.string(),
    tags: z.array(tagSchema),
  });
  const form = useForm<z.infer<typeof listForm>>({
    resolver: zodResolver(listForm),
    defaultValues: {
      title: '',
      tags: [],
    },
  });

  const filteredNotes = useMemo(() => {
    return notes.filter((note) => {
      const title = form.watch('title');
      const selectedTags = form.watch('tags');
      return (
        (title === '' ||
          note.title.toLowerCase().includes(title.toLowerCase())) &&
        (selectedTags.length === 0 ||
          selectedTags.every((tag) =>
            note.tags.some((noteTag) => noteTag.id === tag.id)
          ))
      );
    });
  }, [form.watch]);

  return (
    <>
      <h1 className='w-full flex justify-between'>
        <span className=''>Notes</span>
        <div className='inline-flex gap-2'>
          <Link to='/new'>
            <Button>Create</Button>
          </Link>
          <Button variant='secondary'>Edit Tags</Button>
        </div>
      </h1>
      <Form {...form}>
        <div className='grid grid-cols-2 gap-2 w-full'>
          <FormField
            control={form.control}
            name='title'
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor='title'>Title</FormLabel>
                <FormControl>
                  <Input id='title' placeholder='shadcn' {...field} />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='tags'
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor='tags'>Tags</FormLabel>
                <FormControl>
                  <TagsSelector
                    id='tags'
                    selected={field.value}
                    onSelectChange={(value) => {
                      field.onChange(
                        value.map((tag) => ({ id: tag.id, label: tag.label }))
                      );
                    }}
                    options={availableTags}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>
      </Form>
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
    <Card id={id} className='cursor-pointer'>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription className='flex gap-2 mt-1'>
          {tags.map(({ id, label }) => (
            <Badge id={id} key={id} variant='secondary'>
              {label}
            </Badge>
          ))}
        </CardDescription>
      </CardHeader>
    </Card>
  );
}
