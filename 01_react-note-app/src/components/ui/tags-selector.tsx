'use client';

import { Calendar, Check, X as RemoveIcon } from 'lucide-react';
import React from 'react';
import { cn } from '@/lib/utils';
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';

// const SPLITTER_REGEX = /[\n#?=&\t,./-]+/;
// const FORMATTING_REGEX = /^[^\w]*|[^\w]*$/g;

export type Option = {
  id: string;
  label: string;
};

interface TagsSelectorProps extends React.ComponentProps<'button'> {
  selected: Option[];
  onSelectChange: (value: Option[]) => void;
  options: Option[];
  onCreateOption: (value: string) => void;
  placeholder?: string;
  max?: number;
  min?: number;
  id?: string;
}

export function TagsSelector({
  selected,
  onSelectChange,
  options = [],
  onCreateOption,
  placeholder,
  max = Infinity,
  min = 0,
  ...props
}: TagsSelectorProps) {
  const [inputValue, setInputValue] = React.useState('');
  const [disableInput, setDisableInput] = React.useState(false);
  const [disableButton, setDisableButton] = React.useState(false);
  const [open, setOpen] = React.useState(false);

  const addSelect = React.useCallback(
    (id: string) => {
      console.log('add Select');
      if (!selected.find((opt) => opt.id === id) && selected.length < max) {
        const opt = options.find((opt) => opt.id === id);
        if (!opt) {
          console.error('在可用选项中没有找到', id);
        } else {
          onSelectChange([...selected, opt]);
        }
      }
    },
    [selected]
  );

  const removeSelect = React.useCallback(
    (id: string) => {
      if (selected.length > min) {
        onSelectChange(selected.filter((tag) => tag.id !== id));
      }
    },
    [selected]
  );

  // const handlePaste = React.useCallback(
  //   (e: React.ClipboardEvent<HTMLInputElement>) => {
  //     e.preventDefault();
  //     const tags = e.clipboardData.getData('text').split(SPLITTER_REGEX);
  //     const newValue = [...selected];
  //     tags.forEach((item) => {
  //       const parsedItem = item.replaceAll(FORMATTING_REGEX, '').trim();
  //       if (
  //         parsedItem.length > 0 &&
  //         !newValue.includes(parsedItem) &&
  //         newValue.length < max
  //       ) {
  //         newValue.push(parsedItem);
  //       }
  //     });
  //     onSelectChange(newValue);
  //     setInputValue('');
  //   },
  //   [selected]
  // );

  React.useEffect(() => {
    const VerifyDisable = () => {
      if (selected.length - 1 >= min) {
        setDisableButton(false);
      } else {
        setDisableButton(true);
      }
      if (selected.length + 1 <= max) {
        setDisableInput(false);
      } else {
        setDisableInput(true);
      }
    };
    VerifyDisable();
  }, [selected]);

  const handleKeyDown = React.useCallback(
    async (e: React.KeyboardEvent<HTMLInputElement>) => {
      e.stopPropagation();

      // const target = e.currentTarget;
      // console.log(e.key);

      switch (e.key) {
        case 'Enter': {
          if (inputValue.trim() !== '') {
            e.preventDefault();

            if (options.find((tag) => tag.label === inputValue)) return;
            onCreateOption(inputValue);
            setInputValue('');
          }
          break;
        }
      }
    },
    [selected, inputValue, removeSelect]
  );

  const mousePreventDefault = React.useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleInputChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      console.log('handleInputChange');
      setInputValue(e.currentTarget.value);
    },
    []
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        onClick={(e) => e.currentTarget.focus()}
        tabIndex={0}
        className={cn(
          "border-input data-[placeholder]:text-muted-foreground [&_svg:not([class*='text-'])]:text-muted-foreground overflow-hidden",
          'focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40',
          'aria-invalid:border-destructive dark:bg-input/30 dark:hover:bg-input/50 ring-muted h-9 bg-background',
          'flex w-full items-center justify-start gap-2 rounded-md border bg-transparent px-3 py-2 text-sm whitespace-nowrap shadow-xs',
          'transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50',
          'focus-within:ring-ring/50 focus-within:border-ring focus-within:ring-[3px]',
          open ? 'ring-ring/50 border-ring ring-[3px]' : '', // handle border&box-shadow when popover open
          props.className
        )}
        {...props}
      >
        {selected.map((opt) => (
          <Badge
            tabIndex={0}
            key={opt.id}
            aria-disabled={disableButton}
            className={cn(
              'relative px-1 rounded flex items-center gap-1 truncate',
              'aria-disabled:opacity-50 aria-disabled:cursor-not-allowed',
              "data-[active='true']:ring-2 data-[active='true']:ring-muted-foreground"
            )}
            variant={'secondary'}
          >
            <span className='text-xs'>{opt.label}</span>
            <span
              aria-label={`Remove ${opt.label} option`}
              aria-roledescription='button to remove option'
              onMouseDown={mousePreventDefault}
              onClick={() => removeSelect(opt.id)}
              className={cn(disableButton ? 'cursor-not-allowed' : '')}
            >
              <span className='sr-only'>Remove {opt.label} option</span>
              <RemoveIcon className='h-4 w-4 text-gray-400 hover:text-gray-600 cursor-pointer' />
            </span>
          </Badge>
        ))}
      </PopoverTrigger>
      <PopoverContent align='start' className='p-0 border-0 shadow-none'>
        <Command className='rounded-lg border shadow-md md:min-w-[250px]'>
          <CommandInput
            value={inputValue}
            disabled={disableInput}
            placeholder='Type a label or search...'
            onKeyDown={handleKeyDown}
            onChangeCapture={handleInputChange}
          />
          <CommandList>
            <CommandEmpty>
              . No results found.
              <br /> Press 'Enter' to add.
            </CommandEmpty>
            <CommandGroup>
              {options!.map(({ id, label }: Option) => (
                <CommandItem
                  key={id}
                  id={label}
                  className='[&:not(:first-child)]:mt-1 cursor-pointer flex justify-between'
                  onMouseDown={(e) => {
                    e.isPropagationStopped();
                    e.preventDefault();
                    selected.find((opt) => opt.id === id)
                      ? removeSelect(id)
                      : addSelect(id);
                  }}
                >
                  <div className='inline-flex items-center gap-1'>
                    <Calendar />
                    <span>{label}</span>
                  </div>
                  {selected.find((opt) => opt.id === id) && <Check />}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

TagsSelector.displayName = 'TagsSelector';
