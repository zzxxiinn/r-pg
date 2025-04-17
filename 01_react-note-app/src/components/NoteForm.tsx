'use client';
import { useForm } from 'react-hook-form';
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
import { TagsInput } from './ui/tags-input';
import { Textarea } from './ui/textarea';
import { Link } from 'react-router';
import { NoteData, NoteDataSchema } from '@/shemas/note';
import { v4 as uuidV4 } from 'uuid';

type NoteFormProps = {
  onSubmit: (data: NoteData) => void;
};

export function NoteForm({ onSubmit }: NoteFormProps) {
  const form = useForm<NoteData>({
    resolver: zodResolver(NoteDataSchema),
    defaultValues: {
      title: '',
      tags: [],
      markdown: '',
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='sapce-y-8 w-3xl'>
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
                  <TagsInput
                    inputId='tags'
                    onValueChange={(value: string[]) => {
                      field.onChange(
                        value.map((val) => ({
                          id: uuidV4(),
                          label: val,
                        }))
                      );
                    }}
                    value={field.value.map((t) => t.label)}
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
