// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import Icon from 'components/Icon';
import { FormField } from 'modules/form';
import { Label, TextInput, DefaultStyle, Display } from 'components/Form';
import {
  DefaultCustomFieldDefinitionWrapperStyle,
  DraggingIconStyle,
  CustomFieldIconStyle,
  RemoveButtonStyle,
} from './style';

type OptionalProps = {
  editable: boolean,
  deletable: boolean,
  onRemove: Function,
};

type Props = OptionalProps & {
  fieldName: any,
  targetName: string,
  setFieldValue: Function,
  dragHandleProps?: any,
};

const defaultProps = {
  editable: true,
  deletable: true,
  onRemove: () => {},
};

const DefaultCustomFieldDefinitionStyle = ({
  fieldName,
  dragHandleProps,
  targetName,
  setFieldValue,
  editable,
  deletable,
  onRemove,
}: Props) => (
  <div className={DefaultCustomFieldDefinitionWrapperStyle}>
    {editable ? (
      <div className={DraggingIconStyle} {...dragHandleProps}>
        <Icon icon="DRAG_HANDLE" />
      </div>
    ) : (
      <div className={CustomFieldIconStyle}>
        <Icon icon="METADATA" />
      </div>
    )}

    {editable ? (
      <FormField name={`${targetName}.name`} initValue={fieldName} setFieldValue={setFieldValue}>
        {({ name, ...inputHandlers }) => {
          const { isFocused, isTouched, errorMessage, ...rest } = inputHandlers;
          return (
            <DefaultStyle
              width="200px"
              isFocused={isFocused}
              hasError={isTouched && errorMessage}
              type="label"
            >
              <TextInput name={name} {...rest} align="left" />
            </DefaultStyle>
          );
        }}
      </FormField>
    ) : (
      <Label width="200px">{fieldName}</Label>
    )}

    <Display width="200px" height="30px" color="GRAY_LIGHT" style={{ userSelect: 'none' }}>
      <FormattedMessage
        id="components.inputs.customFieldDefinitionPlaceholder"
        defaultMessage="Value will be entered here"
      />
    </Display>

    {deletable && (
      <button className={RemoveButtonStyle} onClick={onRemove} type="button">
        <Icon icon="REMOVE" />
      </button>
    )}
  </div>
);

DefaultCustomFieldDefinitionStyle.defaultProps = defaultProps;

export default DefaultCustomFieldDefinitionStyle;
