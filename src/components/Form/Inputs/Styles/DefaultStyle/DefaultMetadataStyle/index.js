// @flow
import * as React from 'react';
import Icon from 'components/Icon';
import { FormField } from 'modules/form';
import { Label } from 'components/Form';
import { TextInput, DefaultStyle } from 'components/Form/Inputs';

import {
  AdjustmentWrapperStyle,
  AdjustmentFieldsWrapperStyle,
  DragBarStyle,
  EditHandleStyle,
  RemoveButtonStyle,
} from './style';

type OptionalProps = {
  rearrange: boolean,
  isKeyReadOnly: boolean,
  onRemove?: Function,
  width: string,
};

type Props = OptionalProps & {
  metadata: {
    key: string,
    value: string,
  },
  targetName: string,
  setFieldArrayValue: Function,
  dragHandleProps?: any,
};

const defaultProps = {
  rearrange: false,
  isKeyReadOnly: true,
  width: '200px',
};

const DefaultMetadataStyle = ({
  rearrange,
  isKeyReadOnly,
  metadata,
  dragHandleProps,
  targetName,
  setFieldArrayValue,
  onRemove,
  width,
}: Props) => (
  <div className={AdjustmentWrapperStyle}>
    <div className={AdjustmentFieldsWrapperStyle}>
      {rearrange ? (
        <div className={DragBarStyle} {...dragHandleProps}>
          <Icon icon="DRAG_HANDLE" />
        </div>
      ) : (
        <div className={EditHandleStyle}>
          <Icon icon="METADATA" />
        </div>
      )}
      {isKeyReadOnly ? (
        <DefaultStyle type="label" width={width}>
          <Label width={width}>{metadata.key}</Label>
        </DefaultStyle>
      ) : (
        <FormField
          name={`${targetName}.key`}
          initValue={metadata.key}
          setFieldValue={setFieldArrayValue}
        >
          {({ name, ...inputHandlers }) => {
            const { isFocused, isTouched, errorMessage, ...rest } = inputHandlers;
            return (
              <DefaultStyle
                type="label"
                width={width}
                isFocused={isFocused}
                hasError={isTouched && errorMessage}
              >
                <TextInput name={name} {...rest} align="left" />
              </DefaultStyle>
            );
          }}
        </FormField>
      )}

      <FormField
        name={`${targetName}.value`}
        initValue={metadata.value}
        setFieldValue={setFieldArrayValue}
      >
        {({ name, ...inputHandlers }) => {
          const { isFocused, isTouched, errorMessage, ...rest } = inputHandlers;
          return (
            <DefaultStyle width={width} isFocused={isFocused} hasError={isTouched && errorMessage}>
              <TextInput name={name} {...rest} />
            </DefaultStyle>
          );
        }}
      </FormField>

      {onRemove && (
        <button className={RemoveButtonStyle} onClick={onRemove} type="button">
          <Icon icon="REMOVE" />
        </button>
      )}
    </div>
  </div>
);

DefaultMetadataStyle.defaultProps = defaultProps;

export default DefaultMetadataStyle;
