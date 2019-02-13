// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { Subscribe } from 'unstated';
// $FlowFixMe https://github.com/atlassian/react-beautiful-dnd/issues/286#issuecomment-426604779
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { NewButton } from 'components/Buttons';
import GridColumn from 'components/GridColumn';
import { DefaultCustomFieldDefinitionStyle } from 'components/Form';
import { uuid } from 'utils/id';
import { isEquals } from 'utils/fp';
import FieldDefinitionsContainer from 'modules/metadata/components/FieldDefinitionsFormWrapper/container';
import { ContainerStyle, AddButtonWrapperStyle } from './style';

type OptionalProps = {
  fieldDefinitions: Array<Object>,
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

  shouldComponentUpdate(nextProps: Props) {
    const { fieldDefinitions } = this.props;
    return !isEquals(fieldDefinitions, nextProps.fieldDefinitions);
  }

  componentDidUpdate() {
    const { onFormReady } = this.props;
    if (onFormReady) onFormReady();
  }

  render() {
    return (
      <Subscribe to={[FieldDefinitionsContainer]}>
        {({ state, setFieldArrayValue, removeArrayItem }) => {
          const { fieldDefinitions } = state;
          return (
            <div className={ContainerStyle}>
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
                                    <DefaultCustomFieldDefinitionStyle
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
        }}
      </Subscribe>
    );
  }
}

export default FieldDefinitionsForm;
