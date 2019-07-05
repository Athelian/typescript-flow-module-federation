// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import {
  CUSTOM_FIELD_DEFINITIONS_CREATE,
  CUSTOM_FIELD_DEFINITIONS_UPDATE,
  CUSTOM_FIELD_DEFINITIONS_DELETE,
} from 'modules/permission/constants/customFields';
import usePermission from 'hooks/usePermission';
import { NewButton } from 'components/Buttons';
import GridColumn from 'components/GridColumn';
import { DefaultCustomFieldDefinitionStyle } from 'components/Form';
import { uuid } from 'utils/id';
import { ContainerStyle, AddButtonWrapperStyle } from './style';

type OptionalProps = {
  fieldDefinitions: Array<Object>,
  setFieldArrayValue: Function,
  removeArrayItem: Function,
};

type Props = OptionalProps & {};

const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
};

const FieldDefinitionsForm = ({ fieldDefinitions, setFieldArrayValue, removeArrayItem }: Props) => {
  const { hasPermission } = usePermission();
  const allowCreate = hasPermission(CUSTOM_FIELD_DEFINITIONS_CREATE);
  const allowUpdate = hasPermission(CUSTOM_FIELD_DEFINITIONS_UPDATE);
  const allowDelete = hasPermission(CUSTOM_FIELD_DEFINITIONS_DELETE);

  return (
    <div className={ContainerStyle}>
      {allowUpdate ? (
        <DragDropContext
          onDragEnd={(result: any) => {
            if (!result.destination) {
              return;
            }

            setFieldArrayValue(
              'fieldDefinitions',
              reorder(fieldDefinitions, result.source.index, result.destination.index)
            );
          }}
        >
          <Droppable droppableId="droppable">
            {dropProvided => (
              <div ref={dropProvided.innerRef}>
                <GridColumn gap="10px">
                  {fieldDefinitions &&
                    fieldDefinitions.map((fieldDefinition, index) => (
                      <Draggable
                        key={fieldDefinition.id}
                        draggableId={fieldDefinition.id}
                        index={index}
                      >
                        {provided => (
                          <div ref={provided.innerRef} {...provided.draggableProps}>
                            <DefaultCustomFieldDefinitionStyle
                              dragHandleProps={provided.dragHandleProps}
                              targetName={`fieldDefinitions.${index}`}
                              fieldName={fieldDefinition.name}
                              setFieldValue={setFieldArrayValue}
                              onRemove={() => removeArrayItem(`fieldDefinitions.${index}`)}
                              editable
                              deletable={allowDelete}
                            />
                          </div>
                        )}
                      </Draggable>
                    ))}
                </GridColumn>
              </div>
            )}
          </Droppable>
        </DragDropContext>
      ) : (
        <GridColumn gap="10px">
          {fieldDefinitions &&
            fieldDefinitions.map(fieldDefinition => (
              <DefaultCustomFieldDefinitionStyle
                fieldName={fieldDefinition.name}
                editable={false}
                deletable={allowDelete}
              />
            ))}
        </GridColumn>
      )}

      {allowCreate && (
        <div className={AddButtonWrapperStyle}>
          <NewButton
            label={
              <FormattedMessage
                id="modules.metadata.addCustomField"
                defaultMessage="ADD CUSTOM FIELD"
              />
            }
            onClick={() => {
              setFieldArrayValue('fieldDefinitions', [
                ...fieldDefinitions,
                { id: uuid(), name: '', isNew: true },
              ]);
            }}
          />
        </div>
      )}
    </div>
  );
};

export default FieldDefinitionsForm;
