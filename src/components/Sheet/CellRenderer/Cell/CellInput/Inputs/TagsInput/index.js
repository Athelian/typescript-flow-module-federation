// @flow
import * as React from 'react';
import BaseTagsInput from 'components/Inputs/TagsInput';
import type { RenderInputProps } from 'components/Inputs/TagsInput';
import Icon from 'components/Icon';
import Tag from 'components/Tag';
import { isForbidden } from 'utils/data';
import type { InputProps } from 'components/Sheet/CellRenderer/Cell/CellInput/types';
import InputWrapper from '../InputWrapper';
import { TagsSelectStyle, RemoveButtonStyle } from './style';

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

const TagsInput = (entityType: string) => ({
  value,
  focus,
  onChange,
  onFocus,
  onBlur,
}: InputProps<Array<{ id: string, name: string, color: string }>>) => (
  <InputWrapper focus={focus} preselect={false}>
    {({ ref }) => (
      <BaseTagsInput
        inputRef={ref}
        entityType={entityType}
        value={value || []}
        onChange={onChange}
        onFocus={onFocus}
        onBlur={onBlur}
        optionWidth={200}
        renderInput={TagInputRenderer}
      />
    )}
  </InputWrapper>
);

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
