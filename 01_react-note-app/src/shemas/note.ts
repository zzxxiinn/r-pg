import { z } from 'zod';

export const tagSchema = z.object({
  id: z.string(),
  label: z.string(),
});
export type Tag = z.infer<typeof tagSchema>;

export const NoteDataSchema = z.object({
  title: z.string().nonempty('Title is required!'),
  tags: z.array(tagSchema).nonempty('Please at lease one item'),
  markdown: z.string().nonempty('Description is required'),
});
export type NoteData = z.infer<typeof NoteDataSchema>;

export const noteSchema = NoteDataSchema.extend({
  id: z.string(),
});
export type Note = z.infer<typeof noteSchema>;

export const rawNoteDataSchema = z.object({
  title: z.string(),
  markdown: z.string(),
  tagIds: z.array(z.string()),
});
export type RawNoteData = z.infer<typeof rawNoteDataSchema>;

export const rawNoteSchema = rawNoteDataSchema.extend({
  id: z.string(),
});
export type RawNote = z.infer<typeof rawNoteSchema>;
