// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';

// $FlowFixMe https://github.com/atlassian/react-beautiful-dnd/issues/286#issuecomment-426604779
// import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { SaveButton, CancelButton, NewButton } from 'components/Buttons';

import DefaultMetadataStyle from 'components/Form/Inputs/Styles/DefaultStyle/DefaultMetadataStyle';
// import { isEquals } from 'utils/fp';
import { uuid } from 'utils/id';

import FormHeader from '../FormHeader';
import {
  WrapperStyle,
  HeaderStyle,
  ContainerWrapperStyle,
  ContainerStyle,
  AddButtonWrapperStyle,
} from './style';

type OptionalProps = {
  fieldDefinitions: Array<Object>,
  setFieldArrayValue: Function,
  onCancel: Function,
  onSave: Function,
  onFormReady: Function,
};

type Props = OptionalProps & {};

const defaultProps = {
  fieldDefinitions: [],
  onCancel: () => {},
  onSave: () => {},
  onFormReady: () => {},
};

// const reorder = (list, startIndex, endIndex) => {
//   const result = Array.from(list);
//   const [removed] = result.splice(startIndex, 1);
//   result.splice(endIndex, 0, removed);
//   return result;
// };

class FieldDefinitionsForm extends React.Component<Props> {
  static defaultProps = defaultProps;

  componentDidMount() {
    const { onFormReady } = this.props;

    if (onFormReady) onFormReady();
  }

  // shouldComponentUpdate(nextProps: Props) {
  //   const { fieldDefinitions } = this.props;

  //   return !isEquals(fieldDefinitions, nextProps.fieldDefinitions);
  // }

  // componentDidUpdate() {
  //   const { onFormReady } = this.props;

  //   if (onFormReady) onFormReady();
  // }

  // onDragEnd = (result: any) => {
  //   if (!result.destination) {
  //     return;
  //   }
  //   const { fieldDefinitions } = this.state;
  //   this.setState({
  //     fieldDefinitions: reorder(fieldDefinitions, result.source.index, result.destination.index),
  //   });
  // };

  render() {
    const { onCancel, onSave, setFieldArrayValue, fieldDefinitions } = this.props;

    return (
      <div className={WrapperStyle}>
        <div className={HeaderStyle}>
          <FormHeader
            name={
              <FormattedMessage id="modules.metadata.customFields" defaultMessage="CUSTOM FIELDS" />
            }
          >
            <CancelButton onClick={onCancel} />
            <SaveButton onClick={onSave} />
          </FormHeader>
        </div>
        <div className={ContainerWrapperStyle}>
          <div className={ContainerStyle}>
            {fieldDefinitions &&
              fieldDefinitions.map((customField, index) => (
                <DefaultMetadataStyle
                  key={customField.id}
                  isKeyReadOnly={false}
                  isValueReadOnly
                  targetName={`fieldDefinitions.${index}`}
                  width="200px"
                  metadata={customField}
                  setFieldArrayValue={setFieldArrayValue}
                  onRemove={() => {}}
                />
              ))}

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
                    { id: uuid(), name: '' },
                  ]);
                }}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default FieldDefinitionsForm;
