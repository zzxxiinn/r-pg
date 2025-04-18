'use client';
import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from './ui/form';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Link, useNavigate } from 'react-router';
import { NoteData, NoteDataSchema, Tag } from '@/shemas/note';
import { v4 as uuidV4 } from 'uuid';
import { TagsSelector } from './ui/tags-selector';

type NoteFormProps = {
  onSubmit: (data: NoteData) => void;
  onAddTag: (tag: Tag) => void;
  availableTags: Tag[];
};

export function NoteForm({ onSubmit, onAddTag, availableTags }: NoteFormProps) {
  const navigate = useNavigate();
  const form = useForm<NoteData>({
    resolver: zodResolver(NoteDataSchema),
    defaultValues: {
      title: '',
      tags: [],
      markdown: '',
    },
  });

  const handleSubmit: SubmitHandler<NoteData> = (data) => {
    onSubmit(data);
    navigate('..');
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className='sapce-y-8 w-3xl'
      >
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
                <FormDescription>This is your public tag.</FormDescription>
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
                    onCreateOption={(label) => {
                      console.log('onCreateOption');
                      const newTag = { id: uuidV4(), label };
                      onAddTag(newTag);

                      field.onChange([...field.value, newTag]);
                    }}
                  />
                </FormControl>
                <FormDescription>
                  This is your public display name.
                </FormDescription>
              </FormItem>
            )}
          />
        </div>

        <div className='flex w-full gap-2 my-2'>
          <FormField
            control={form.control}
            name='markdown'
            render={({ field }) => (
              <FormItem className='w-full'>
                <FormLabel htmlFor='markdown'>Bodys</FormLabel>
                <FormControl>
                  <Textarea id='markdown' className='max-h-80' {...field} />
                </FormControl>
                <FormDescription>This is your public body</FormDescription>
              </FormItem>
            )}
          />
        </div>
        <div className='flex justify-end w-full gap-2 my-2'>
          <Button type='submit'>Submit</Button>
          <Link to='..'>
            <Button type='reset' variant='secondary'>
              Cancel
            </Button>
          </Link>
        </div>
      </form>
    </Form>
  );
}
