// @flow
import * as React from 'react';
import Icon from 'components/Icon';
import { FormField } from 'modules/form';
import { Label, TextInput, DateInput, DefaultStyle, Display } from 'components/Form';
import {
  DefaultCustomFieldWrapperStyle,
  CustomFieldWrapperStyle,
  CustomFieldIconStyle,
} from './style';

type OptionalProps = {
  value: Object,
  editable: boolean,
};

type Props = OptionalProps & {
  fieldName: any,
  fieldType: string,
  targetName: string,
  setFieldValue: Function,
};

const defaultProps = {
  value: {},
  editable: true,
};

const DefaultCustomFieldStyle = ({
  value,
  fieldName,
  fieldType,
  targetName,
  setFieldValue,
  editable,
}: Props) => (
  <div className={DefaultCustomFieldWrapperStyle}>
    <div className={CustomFieldWrapperStyle}>
      <div className={CustomFieldIconStyle}>
        <Icon icon="METADATA" />
      </div>

      <Label width="200px">{fieldName}</Label>

      {editable ? (
        <FormField
          name={`${targetName}.value.string`}
          initValue={value.string}
          setFieldValue={setFieldValue}
        >
          {({ name, ...inputHandlers }) => {
            const { isFocused, isTouched, errorMessage, ...rest } = inputHandlers;
            return (
              <DefaultStyle
                width="200px"
                isFocused={isFocused}
                hasError={isTouched && errorMessage}
              >
                {fieldType === 'Date' ? (
                  <DateInput name={name} width="200px" {...rest} />
                ) : (
                  <TextInput name={name} {...rest} />
                )}
              </DefaultStyle>
            );
          }}
        </FormField>
      ) : (
        <Display width="200px" height="30px">
          {value.string}
        </Display>
      )}
    </div>
  </div>
);

DefaultCustomFieldStyle.defaultProps = defaultProps;

export default DefaultCustomFieldStyle;
