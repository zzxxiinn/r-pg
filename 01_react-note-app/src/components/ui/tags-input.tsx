'use client';

import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { X as RemoveIcon } from 'lucide-react';
import React from 'react';

const SPLITTER_REGEX = /[\n#?=&\t,./-]+/;
const FORMATTING_REGEX = /^[^\w]*|[^\w]*$/g;

interface TagsInputProps extends React.ComponentPropsWithRef<'div'> {
  value: string[];
  onValueChange: (value: string[]) => void;
  placeholder?: string;
  max?: number;
  min?: number;
}

export function TagsInput({
  children,
  value,
  onValueChange,
  placeholder,
  max,
  min,
  dir,
  ref,
  ...props
}: TagsInputProps) {
  const [activeIndex, setActiveIndex] = React.useState(-1);
  const [inputValue, setInputValue] = React.useState('');
  const [disableInput, setDisableInput] = React.useState(false);
  const [disableButton, setDisableButton] = React.useState(false);
  const [isValueSelected, setIsValueSelected] = React.useState(false);
  const [selectedValue, setSelectedValue] = React.useState('');

  const parsemin = min ?? 0;
  const parsemax = max ?? Infinity;

  const onValueChangeHandler = React.useCallback(
    (val: string) => {
      if (!value.includes(val) && value.length < parsemax) {
        onValueChange([...value, val]);
      }
    },
    [value]
  );

  const removeValue = React.useCallback(
    (val: string) => {
      if (value.includes(val) && value.length > parsemin) {
        onValueChange(value.filter((item) => item !== val));
      }
    },
    [value]
  );

  const handlePaste = React.useCallback(
    (e: React.ClipboardEvent<HTMLInputElement>) => {
      e.preventDefault();
      const tags = e.clipboardData.getData('text').split(SPLITTER_REGEX);
      const newValue = [...value];
      tags.forEach((item) => {
        const parsedItem = item.replaceAll(FORMATTING_REGEX, '').trim();
        if (
          parsedItem.length > 0 &&
          !newValue.includes(parsedItem) &&
          newValue.length < parsemax
        ) {
          newValue.push(parsedItem);
        }
      });
      onValueChange(newValue);
      setInputValue('');
    },
    [value]
  );

  const handleSelect = React.useCallback(
    (e: React.SyntheticEvent<HTMLInputElement>) => {
      const target = e.currentTarget;
      const selection = target.value.substring(
        target.selectionStart ?? 0,
        target.selectionEnd ?? 0
      );

      setSelectedValue(selection);
      setIsValueSelected(selection === inputValue);
    },
    [inputValue]
  );

  React.useEffect(() => {
    const VerifyDisable = () => {
      if (value.length - 1 >= parsemin) {
        setDisableButton(false);
      } else {
        setDisableButton(true);
      }
      if (value.length + 1 <= parsemax) {
        setDisableInput(false);
      } else {
        setDisableInput(true);
      }
    };
    VerifyDisable();
  }, [value]);

  const handleKeyDown = React.useCallback(
    async (e: React.KeyboardEvent<HTMLInputElement>) => {
      e.stopPropagation();

      const moveNext = () => {
        const nextIndex =
          activeIndex + 1 > value.length - 1 ? -1 : activeIndex + 1;
        setActiveIndex(nextIndex);
      };

      const movePrev = () => {
        const prevIndex =
          activeIndex - 1 < 0 ? value.length - 1 : activeIndex - 1;
        setActiveIndex(prevIndex);
      };

      const moveCurrent = () => {
        const newIndex =
          activeIndex - 1 <= 0
            ? value.length - 1 === 0
              ? -1
              : 0
            : activeIndex - 1;
        setActiveIndex(newIndex);
      };
      const target = e.currentTarget;

      // ? Suggest : the multi select should support the same pattern

      switch (e.key) {
        case 'ArrowLeft': {
          if (dir === 'rtl') {
            if (value.length > 0 && activeIndex !== -1) {
              moveNext();
            }
          } else {
            if (value.length > 0 && target.selectionStart === 0) {
              movePrev();
            }
          }
          break;
        }

        case 'ArrowRight': {
          if (dir === 'rtl') {
            if (value.length > 0 && target.selectionStart === 0) {
              movePrev();
            }
          } else {
            if (value.length > 0 && activeIndex !== -1) {
              moveNext();
            }
          }
          break;
        }
        case 'Backspace':
        case 'Delete': {
          if (value.length > 0) {
            if (activeIndex !== -1 && activeIndex < value.length) {
              removeValue(value[activeIndex]);
              moveCurrent();
            } else {
              if (target.selectionStart === 0) {
                if (selectedValue === inputValue || isValueSelected) {
                  removeValue(value[value.length - 1]);
                }
              }
            }
          }
          break;
        }

        case 'Escape': {
          const newIndex = activeIndex === -1 ? value.length - 1 : -1;
          setActiveIndex(newIndex);
          break;
        }

        case 'Enter': {
          if (inputValue.trim() !== '') {
            e.preventDefault();
            onValueChangeHandler(inputValue);
            setInputValue('');
          }
          break;
        }
      }
    },
    [activeIndex, value, inputValue, removeValue]
  );

  const mousePreventDefault = React.useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setInputValue(e.currentTarget.value);
    },
    []
  );

  console.log('check value: -->', value);

  return (
    <div
      {...props}
      ref={ref}
      dir={dir}
      className={cn(
        'flex items-center flex-wrap h-9 gap-1 py-1 px-2 rounded-md bg-background',
        'overflow-hidden border-input border dark:bg-input/30  ring-muted shadow-xs transition-[color,box-shadow]',
        {
          'focus-within:ring-ring/50 focus-within:border-ring focus-within:ring-[3px]':
            activeIndex === -1,
        },
        props.className
      )}
    >
      {value.map((item, index) => (
        <Badge
          tabIndex={activeIndex !== -1 ? 0 : activeIndex}
          key={item}
          aria-disabled={disableButton}
          data-active={activeIndex === index}
          className={cn(
            'relative px-1 rounded flex items-center gap-1 truncate',
            'aria-disabled:opacity-50 aria-disabled:cursor-not-allowed',
            "data-[active='true']:ring-2 data-[active='true']:ring-muted-foreground"
          )}
          variant={'secondary'}
        >
          <span className='text-xs'>{item}</span>
          <button
            type='button'
            aria-label={`Remove ${item} option`}
            aria-roledescription='button to remove option'
            disabled={disableButton}
            onMouseDown={mousePreventDefault}
            onClick={() => removeValue(item)}
            className='disabled:cursor-not-allowed'
          >
            <span className='sr-only'>Remove {item} option</span>
            <RemoveIcon className='h-4 w-4 text-gray-400 hover:text-gray-600 cursor-pointer' />
          </button>
        </Badge>
      ))}
      <Input
        tabIndex={0}
        aria-label='input tag'
        value={inputValue}
        disabled={disableInput}
        placeholder={placeholder}
        onKeyDown={handleKeyDown}
        onPaste={handlePaste}
        onSelect={handleSelect}
        onChange={activeIndex === -1 ? handleChange : undefined}
        onClick={() => setActiveIndex(-1)}
        className={cn(
          'outline-0 border-none h-6 min-w-fit flex-1 placeholder:text-muted-foreground px-1 shadow-none',
          'focus-visible:outline-0 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-0',
          activeIndex !== -1 && 'caret-transparent'
        )}
      />
    </div>
  );
}

TagsInput.displayName = 'TagsInput';
