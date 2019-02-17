// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import EnumProvider from 'providers/enum';
import {
  parseEnumDescriptionOrValue,
  convertValueToFormFieldFormat,
} from 'modules/form/factories/helpers';
import { isDataType } from 'utils/fp';
import Icon from 'components/Icon';
import UserAvatar from 'components/UserAvatar';
import FormattedDate from 'components/FormattedDate';
import GridRow from 'components/GridRow';
import { FormField } from 'modules/form';
import {
  Label,
  Display,
  SelectInput,
  DefaultSelect,
  DefaultOptions,
  TextAreaInput,
  DefaultStyle,
} from 'components/Form';
import {
  AdjustmentWrapperStyle,
  AdjustmentFieldsWrapperStyle,
  MemoButtonStyle,
  RemoveButtonStyle,
  MemoSectionWrapperStyle,
  LastModifiedWrapperStyle,
  UserIconStyle,
} from './style';

type OptionalProps = {
  editable: boolean,
};

type Props = OptionalProps & {
  adjustment: Object,
  index: number,
  setFieldArrayValue: Function,
  removeArrayItem: Function,
  enumType: string,
  targetName: string,
  typeName: string,
  memoName: string,
  valueInput: React.Node,
};

export const defaultProps = {
  editable: true,
};

type State = {
  isMemoOpen: boolean,
};

class DefaultAdjustmentStyle extends React.Component<Props, State> {
  static defaultProps = defaultProps;

  state = {
    isMemoOpen: false,
  };

  toggleMemo = () => {
    const { isMemoOpen } = this.state;

    this.setState({ isMemoOpen: !isMemoOpen });
  };

  render() {
    const {
      adjustment,
      index,
      editable,
      setFieldArrayValue,
      removeArrayItem,
      enumType,
      targetName,
      typeName,
      memoName,
      valueInput,
    } = this.props;
    const { isMemoOpen } = this.state;

    const hasMemo = !!adjustment[memoName];

    const updatedByFirstName = adjustment.updatedBy ? adjustment.updatedBy.firstName : null;
    const updatedByLastName = adjustment.updatedBy ? adjustment.updatedBy.lastName : null;

    return (
      <div className={AdjustmentWrapperStyle}>
        <div className={AdjustmentFieldsWrapperStyle}>
          <button
            className={MemoButtonStyle(isMemoOpen, hasMemo)}
            onClick={this.toggleMemo}
            type="button"
          >
            <Icon icon={hasMemo || !editable ? 'MEMO' : 'MEMO_ADD'} />
          </button>

          <FormField
            name={`${targetName}.${index}.${typeName}`}
            initValue={adjustment[typeName]}
            setFieldValue={setFieldArrayValue}
          >
            {({ name, onChange, ...inputHandlers }) => (
              <EnumProvider enumType={enumType}>
                {({ loading, error, data }) => {
                  const itemToString = parseEnumDescriptionOrValue;
                  const itemToValue = item => (item ? item.name : '');

                  return error ? (
                    `Error!: ${error}`
                  ) : (
                    <SelectInput
                      {...inputHandlers}
                      onChange={newValue =>
                        onChange(convertValueToFormFieldFormat(itemToValue(newValue)))
                      }
                      name={name}
                      items={loading ? [] : data}
                      renderSelect={({ ...rest }) => (
                        <DefaultSelect required width="200px" height="30px" {...rest} />
                      )}
                      renderOptions={({ ...rest }) => <DefaultOptions width="200px" {...rest} />}
                      itemToString={itemToString}
                      itemToValue={itemToValue}
                      type="label"
                      align="left"
                      readOnlyWidth="200px"
                      readOnlyHeight="30px"
                      readOnly={!editable}
                    />
                  );
                }}
              </EnumProvider>
            )}
          </FormField>

          {valueInput}

          {editable && (
            <button
              className={RemoveButtonStyle}
              onClick={() => {
                removeArrayItem(`${targetName}[${index}]`);
              }}
              type="button"
            >
              <Icon icon="REMOVE" />
            </button>
          )}
        </div>
        <div className={MemoSectionWrapperStyle(isMemoOpen)}>
          <div className={LastModifiedWrapperStyle}>
            <Label>
              <FormattedMessage id="components.form.lastModified" defaultMessage="LAST MODIFIED" />
            </Label>
            <GridRow gap="5px">
              {isDataType(Date, adjustment.updatedAt) && (
                <Display>
                  <FormattedDate value={adjustment.updatedAt} />
                </Display>
              )}
              {updatedByFirstName && updatedByLastName && (
                <div className={UserIconStyle}>
                  <UserAvatar
                    firstName={updatedByFirstName}
                    lastName={updatedByLastName}
                    width="20px"
                    height="20px"
                  />
                </div>
              )}
            </GridRow>
          </div>
          <FormField
            name={`${targetName}.${index}.${memoName}`}
            initValue={adjustment[memoName]}
            setFieldValue={setFieldArrayValue}
          >
            {({ isFocused, ...inputHandlers }) =>
              editable ? (
                <DefaultStyle type="textarea" width="360px" height="150px" isFocused={isFocused}>
                  <TextAreaInput {...inputHandlers} align="left" />
                </DefaultStyle>
              ) : (
                <TextAreaInput
                  {...inputHandlers}
                  readOnly
                  readOnlyWidth="360px"
                  readOnlyHeight="150px"
                  align="left"
                />
              )
            }
          </FormField>
        </div>
      </div>
    );
  }
}

export default DefaultAdjustmentStyle;
