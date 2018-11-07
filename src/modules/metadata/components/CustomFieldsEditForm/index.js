// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
// $FlowFixMe https://github.com/atlassian/react-beautiful-dnd/issues/286#issuecomment-426604779
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { SaveButton, CancelButton, NewButton } from 'components/Buttons';

import DefaultMetadataStyle from 'components/Form/Inputs/Styles/DefaultStyle/DefaultMetadataStyle';

import FormHeader from '../FormHeader';
import {
  CustomFieldsEditFormWrapperStyle,
  CustomFieldsEditFormContainerWrapperStayle,
  AddButtonWrapperStyle,
} from './style';

type OptionalProps = {
  values: Array<Object>,
  onCancel: Function,
  onSave: Function,
};

type Props = OptionalProps & {};

type State = {
  metadatas: Array<Object>,
};

const dummyMetadatas = [
  {
    key: '1',
    value: 1,
  },
  {
    key: '2',
    value: 2,
  },
  {
    key: '3',
    value: 3,
  },
  {
    key: '4',
    value: 4,
  },
];

const defaultProps = {
  values: dummyMetadatas,
  onCancel: () => {},
  onSave: () => {},
};

const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
};

class CustomFieldsEditForm extends React.Component<Props, State> {
  static defaultProps = defaultProps;

  constructor(props: Props) {
    super(props);
    const { values: metadatas } = props;
    this.state = {
      metadatas,
    };
  }

  onDragEnd = (result: any) => {
    if (!result.destination) {
      return;
    }
    const { metadatas } = this.state;
    this.setState({
      metadatas: reorder(metadatas, result.source.index, result.destination.index),
    });
  };

  render() {
    const { onCancel, onSave } = this.props;
    const { metadatas } = this.state;

    return (
      <div className={CustomFieldsEditFormWrapperStyle}>
        <div>
          <FormHeader
            name={
              <FormattedMessage id="modules.metadata.customFields" defaultMessage="CUSTOM FIELDS" />
            }
          >
            <CancelButton onClick={onCancel} />
            <SaveButton onClick={onSave} />
          </FormHeader>
        </div>
        <div className={CustomFieldsEditFormContainerWrapperStayle}>
          <DragDropContext onDragEnd={this.onDragEnd}>
            <Droppable droppableId="droppable">
              {DropProvided => (
                <div ref={DropProvided.innerRef}>
                  {metadatas.map((metadata, index) => (
                    <Draggable key={metadata.key} draggableId={metadata.key} index={index}>
                      {provided => (
                        <div ref={provided.innerRef}>
                          <div ref={provided.innerRef} {...provided.draggableProps}>
                            <DefaultMetadataStyle
                              rearrange
                              isKeyReadOnly={false}
                              dragHandleProps={provided.dragHandleProps}
                              targetName={`metadata_${metadata.key}`}
                              width="240px"
                              metadata={metadata}
                              setFieldArrayValue={() => {}}
                              onRemove={() => {}}
                            />
                          </div>
                        </div>
                      )}
                    </Draggable>
                  ))}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </div>
        <div className={AddButtonWrapperStyle}>
          <NewButton
            label={
              <FormattedMessage
                id="modules.metadata.addCustomFields"
                defaultMessage="ADD CUSTOM FIELDS"
              />
            }
            onClick={() => {
              this.setState({
                metadatas: [...metadatas, { key: '', value: '' }],
              });
            }}
          />
        </div>
      </div>
    );
  }
}

export default CustomFieldsEditForm;
