import * as React from 'react';
/* eslint-disable import/no-extraneous-dependencies */
import { storiesOf } from '@storybook/react';
// action
import { action } from '@storybook/addon-actions';
import { Provider, Subscribe } from 'unstated';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

import MetadataFormContainer from './container';
import DefaultMetadataStyle from '../index';

storiesOf('DefaultMetadataStyle', module)
  .add('input', () => (
    <div
      style={{
        marginLeft: 50,
        marginTop: 50,
        width: 330,
        height: 200,
      }}
    >
      <Provider>
        <Subscribe to={[MetadataFormContainer]}>
          {(originalValues, state, setFieldValue) => {
            const values = { ...originalValues, ...state };
            return (
              <DefaultMetadataStyle
                targetName="story-metadata"
                width="150px"
                metadata={values.state.metadata}
                index={1}
                setFieldArrayValue={setFieldValue}
                onRemove={action('remove')}
              />
            );
          }}
        </Subscribe>
      </Provider>
    </div>
  ))
  .add('drag', () => (
    <div
      style={{
        marginLeft: 50,
        marginTop: 50,
        width: 330,
        height: 200,
      }}
    >
      <DragDropContext onDragEnd={action('onDragEnd')}>
        <Droppable droppableId="droppable">
          {DropProvided => (
            <div ref={DropProvided.innerRef}>
              <Draggable draggableId="draggable">
                {provided => (
                  <div ref={provided.innerRef}>
                    <div ref={provided.innerRef} {...provided.draggableProps}>
                      <Provider>
                        <Subscribe to={[MetadataFormContainer]}>
                          {(originalValues, state, setFieldValue) => {
                            const values = { ...originalValues, ...state };
                            return (
                              <DefaultMetadataStyle
                                dragHandleProps={provided.dragHandleProps}
                                targetName="story-metadata"
                                width="150px"
                                metadata={values.state.metadata}
                                index={1}
                                setFieldArrayValue={setFieldValue}
                                onRemove={action('remove')}
                              />
                            );
                          }}
                        </Subscribe>
                      </Provider>
                    </div>
                    {provided.placeholder}
                  </div>
                )}
              </Draggable>
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  ));
