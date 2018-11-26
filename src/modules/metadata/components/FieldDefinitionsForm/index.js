// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';

// $FlowFixMe https://github.com/atlassian/react-beautiful-dnd/issues/286#issuecomment-426604779
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { NewButton } from 'components/Buttons';
import GridColumn from 'components/GridColumn';
import DefaultCustomFieldStyle from 'components/Form/Inputs/Styles/DefaultStyle/DefaultCustomFieldStyle';
import { uuid } from 'utils/id';
import { ContainerStyle, AddButtonWrapperStyle } from './style';

type OptionalProps = {
  fieldDefinitions: Array<Object>,
  setFieldArrayValue: Function,
  removeArrayItem: Function,
  onFormReady: Function,
};

type Props = OptionalProps & {};

const defaultProps = {
  fieldDefinitions: [],
  onFormReady: () => {},
};

const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
};

class FieldDefinitionsForm extends React.Component<Props> {
  static defaultProps = defaultProps;

  componentDidMount() {
    const { onFormReady } = this.props;

    if (onFormReady) onFormReady();
  }

  onDragEnd = (result: any) => {
    if (!result.destination) {
      return;
    }
    const { fieldDefinitions, setFieldArrayValue } = this.props;
    setFieldArrayValue(
      'fieldDefinitions',
      reorder(fieldDefinitions, result.source.index, result.destination.index)
    );
  };

  render() {
    const { setFieldArrayValue, fieldDefinitions, removeArrayItem } = this.props;

    return (
      <div className={ContainerStyle}>
        <DragDropContext onDragEnd={this.onDragEnd}>
          <Droppable droppableId="droppable">
            {dropProvided => (
              <GridColumn gap="10px">
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
                              <DefaultCustomFieldStyle
                                rearrange
                                dragHandleProps={provided.dragHandleProps}
                                isKeyReadOnly={false}
                                isValueReadOnly
                                targetName={`fieldDefinitions.${index}`}
                                width="200px"
                                fieldName={fieldDefinition.name}
                                setFieldArrayValue={setFieldArrayValue}
                                onRemove={() => removeArrayItem(`fieldDefinitions.${index}`)}
                              />
                            </div>
                          )}
                        </Draggable>
                      ))}
                  </GridColumn>
                </div>
              </GridColumn>
            )}
          </Droppable>
        </DragDropContext>

        <div className={AddButtonWrapperStyle}>
          <NewButton
            label={
              <FormattedMessage
                id="modules.metadata.addCustomFields"
                defaultMessage="ADD CUSTOM FIELDS"
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
      </div>
    );
  }
}

export default FieldDefinitionsForm;
