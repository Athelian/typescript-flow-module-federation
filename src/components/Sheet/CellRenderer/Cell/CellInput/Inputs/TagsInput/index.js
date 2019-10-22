// @flow
import * as React from 'react';
import BaseTagsInput from 'components/Inputs/TagsInput';
import type { RenderInputProps } from 'components/Inputs/TagsInput';
import Icon from 'components/Icon';
import Tag from 'components/Tag';
import { isForbidden } from 'utils/data';
import type { InputProps } from '../../types';
import { TagsSelectStyle, RemoveButtonStyle } from './style';

type Props = {
  entityType: string,
} & InputProps<Array<{ id: string, name: string, color: string }>>;

const TagInputRenderer = ({ getInputProps, remove, selectedItems }: RenderInputProps) => {
  return (
    <div
      className={TagsSelectStyle}
      role="presentation"
      onClick={() => {
        // openMenu();
      }}
    >
      {(selectedItems || [])
        .filter(item => !isForbidden(item))
        .map(tag => (
          <Tag
            key={tag.id}
            tag={tag}
            suffix={
              <button
                type="button"
                className={RemoveButtonStyle}
                onClick={event => {
                  event.stopPropagation();
                  remove(tag);
                }}
              >
                <Icon icon="CLEAR" />
              </button>
            }
          />
        ))}

      <input
        {...getInputProps({
          spellCheck: false,
        })}
      />
    </div>
  );
};

const TagsInputImpl = ({ entityType, value, focus, onChange, onFocus, onBlur }: Props) => {
  const inputRef = React.useRef<HTMLButtonElement | null>(null);
  React.useEffect(() => {
    if (!inputRef.current) {
      return;
    }

    const input = inputRef.current;

    if (focus) {
      // $FlowIssue: Flow doesn't know focus options
      input.focus({
        preventScroll: true,
      });
    } else {
      input.blur();
    }
  }, [focus]);

  return (
    <BaseTagsInput
      inputRef={inputRef}
      entityType={entityType}
      value={value || []}
      onChange={onChange}
      onFocus={onFocus}
      onBlur={onBlur}
      optionWidth={200}
      renderInput={TagInputRenderer}
    />
  );
};

const TagsInput = (entityType: string) => (
  props: InputProps<Array<{ id: string, name: string, color: string }>>
) => <TagsInputImpl entityType={entityType} {...props} />;

export default {
  Product: TagsInput('Product'),
  Order: TagsInput('Order'),
  OrderItem: TagsInput('OrderItem'),
  Batch: TagsInput('Batch'),
  Shipment: TagsInput('Shipment'),
  Container: TagsInput('Container'),
  User: TagsInput('User'),
  Task: TagsInput('Task'),
  Project: TagsInput('Project'),
};
