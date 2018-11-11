// @flow
import React from 'react';
import { FormattedMessage } from 'react-intl';
// $FlowFixMe https://github.com/atlassian/react-beautiful-dnd/issues/286#issuecomment-426604779
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Subscribe } from 'unstated';
import DefaultMetadataStyle from 'components/Form/Inputs/Styles/DefaultStyle/DefaultMetadataStyle';
import { NewButton } from 'components/Buttons';
import { uuid } from 'utils/id';
import MetadataFormContainer from '../../container';

import { AddButtonWrapperStyle } from './style';

const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
};

const handleDragEnd = (result, metadata, setFieldArrayValue) => {
  if (!result.destination) {
    return;
  }
  setFieldArrayValue('metadata', reorder(metadata, result.source.index, result.destination.index));
};

const MetadataEditForm = () => (
  <Subscribe to={[MetadataFormContainer]}>
    {({ originalValues, state, setFieldArrayValue, removeArrayItem }) => {
      const values = { ...originalValues, ...state };
      return (
        <DragDropContext
          onDragEnd={result => handleDragEnd(result, values.metadata, setFieldArrayValue)}
        >
          <Droppable droppableId="droppable">
            {dropProvided => (
              <div>
                <div ref={dropProvided.innerRef}>
                  {values &&
                    values.metadata.map((metadata, index) => (
                      <Draggable key={metadata.key} draggableId={metadata.key} index={index}>
                        {provided => (
                          <div key={uuid()} ref={provided.innerRef} {...provided.draggableProps}>
                            <DefaultMetadataStyle
                              rearrange
                              dragHandleProps={provided.dragHandleProps}
                              isKeyReadOnly={false}
                              targetName={`metadata.${index}`}
                              metadata={metadata}
                              setFieldArrayValue={setFieldArrayValue}
                              onRemove={() => removeArrayItem(`metadata.${index}`)}
                            />
                          </div>
                        )}
                      </Draggable>
                    ))}
                </div>
                <div className={AddButtonWrapperStyle}>
                  <NewButton
                    label={
                      <FormattedMessage
                        id="modules.order.addCustomFieldB"
                        defaultMessage="ADD CUSTOM FIELDS"
                      />
                    }
                    onClick={() => {
                      setFieldArrayValue(`metadata.${values.metadata.length}`, {
                        key: '',
                        value: '',
                      });
                    }}
                  />
                </div>
              </div>
            )}
          </Droppable>
        </DragDropContext>
      );
    }}
  </Subscribe>
);

export default MetadataEditForm;
