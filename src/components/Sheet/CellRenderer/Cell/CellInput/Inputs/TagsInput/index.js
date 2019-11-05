// @flow
import * as React from 'react';
import { cx } from 'react-emotion';
import BaseTagsInput from 'components/Inputs/TagsInput';
import type { RenderInputProps } from 'components/Inputs/TagsInput';
import Icon from 'components/Icon';
import Tag from 'components/Tag';
import { isForbidden } from 'utils/data';
import type { InputProps } from 'components/Sheet/CellRenderer/Cell/CellInput/types';
import { CellInputWrapperStyle } from 'components/Sheet/CellRenderer/Cell/CellInput/Common/style';
import { TagsSelectStyle, RemoveButtonStyle, TagsInputWrapperStyle } from './style';

const TagInputRenderer = ({ getInputProps, remove, selectedItems }: RenderInputProps) => (
  <div className={TagsSelectStyle}>
    {(selectedItems || [])
      .filter(item => !isForbidden(item))
      .map(tag => (
        <Tag
          key={tag.id}
          tag={tag}
          suffix={
            <button
              tabIndex="-1"
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

const TagsInput = (entityType: string) => ({
  value,
  onChange,
}: InputProps<Array<{ id: string, name: string, color: string }>>) => (
  <div className={cx(CellInputWrapperStyle, TagsInputWrapperStyle)}>
    <BaseTagsInput
      entityType={entityType}
      value={value || []}
      onChange={onChange}
      optionWidth={200}
      renderInput={TagInputRenderer}
    />
  </div>
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
