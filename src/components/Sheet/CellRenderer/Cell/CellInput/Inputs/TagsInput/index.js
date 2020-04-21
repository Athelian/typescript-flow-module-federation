// @flow
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {
  DragDropContext,
  Droppable,
  Draggable,
  type DraggableProvided,
  type DraggableStateSnapshot,
} from 'react-beautiful-dnd';
import usePortalSlot from 'hooks/usePortalSlot';
import BaseTagsInput from 'components/Inputs/TagsInput';
import type { Tag as TagType } from 'generated/graphql';
import type { RenderInputProps } from 'components/Inputs/TagsInput';
import Icon from 'components/Icon';
import Tag from 'components/Tag';
import { isForbidden, isNotFound } from 'utils/data';
import type { InputProps } from 'components/Sheet/CellRenderer/Cell/CellInput/types';
import {
  TagsSelectStyle,
  RemoveButtonStyle,
  TagsInputWrapperStyle,
  DroppableWrapperStyle,
} from './style';

type DraggableTagRendererProps = {
  tag: TagType,
  remove: Function,
  provided: DraggableProvided,
  snapshot: DraggableStateSnapshot,
};

const DraggableTagRenderer = ({ tag, remove, provided, snapshot }: DraggableTagRendererProps) => {
  const slot = usePortalSlot('dragging_tag');

  const result = (
    <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
      <Tag
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
    </div>
  );

  return snapshot.isDragging ? ReactDOM.createPortal(result, slot) : result;
};

const TagInputRenderer = ({
  disabled,
  getInputProps,
  onChange,
  remove,
  isOpen,
  selectedItems,
}: RenderInputProps) => (
  <div className={TagsSelectStyle}>
    {disabled ? (
      (selectedItems || [])
        .filter(item => !isForbidden(item) && !isNotFound(item))
        .map(tag => <Tag key={tag.id} tag={tag} />)
    ) : (
      <DragDropContext
        onDragEnd={(result: any) => {
          if (!result.destination) {
            return;
          }
          const sourceIndex = result.source.index;
          const destinationIndex = result.destination.index;

          const reorderedColumns = [...selectedItems];
          const [removed] = reorderedColumns.splice(sourceIndex, 1);
          reorderedColumns.splice(destinationIndex, 0, removed);

          onChange(reorderedColumns);
        }}
      >
        <Droppable droppableId="droppableTags" direction="horizontal">
          {dropProvided => (
            <div
              ref={dropProvided.innerRef}
              {...dropProvided.droppableProps}
              className={DroppableWrapperStyle}
            >
              {(selectedItems ?? [])
                .filter(item => !isForbidden(item) && !isNotFound(item))
                .map((tag, index) => (
                  <Draggable key={tag.id} draggableId={tag.id} index={index}>
                    {(provided, snapshot) => (
                      <DraggableTagRenderer
                        tag={tag}
                        remove={remove}
                        provided={provided}
                        snapshot={snapshot}
                      />
                    )}
                  </Draggable>
                ))}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    )}

    <input
      {...getInputProps({
        spellCheck: false,
        'data-focus-first': true,
        onKeyDown: e => {
          if (e.key === 'Enter' && isOpen) {
            e.preventDefault();
            e.stopPropagation();
          }
        },
      })}
    />
  </div>
);

const TagsInput = (entityType: string) => ({
  value,
  onChange,
  readonly,
}: InputProps<Array<{ id: string, name: string, color: string }>>) => (
  <div className={TagsInputWrapperStyle}>
    <BaseTagsInput
      entityType={entityType}
      value={value || []}
      disabled={readonly}
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
