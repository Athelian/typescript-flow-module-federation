// @flow
import * as React from 'react';
import EnumProvider from 'providers/enum';
import Icon from 'components/Icon';
import UserAvatar from 'components/UserAvatar';
import FormattedDate from 'components/FormattedDate';
import GridRow from 'components/GridRow';
import { FormField } from 'modules/form';
import {
  Label,
  Display,
  DefaultStyle,
  SelectInput,
  TextAreaInput,
  DefaultSelect,
  DefaultOptions,
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
  isNew: boolean,
};

type Props = OptionalProps & {
  adjustment: Object,
  index: number,
  setFieldArrayValue: Function,
  removeArrayItem: Function,
  formHelper: any,
  activeField: any,
  enumType: string,
  targetName: string,
  typeName: string,
  memoName: string,
  valueInput: React.Node,
};

export const defaultProps = {
  isNew: false,
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
      isNew,
      setFieldArrayValue,
      removeArrayItem,
      formHelper,
      activeField,
      enumType,
      targetName,
      typeName,
      memoName,
      valueInput,
    } = this.props;
    const { isMemoOpen } = this.state;

    const hasMemo = !!adjustment[memoName];

    return (
      <div className={AdjustmentWrapperStyle}>
        <div className={AdjustmentFieldsWrapperStyle}>
          <button
            className={MemoButtonStyle(isMemoOpen, hasMemo)}
            onClick={this.toggleMemo}
            type="button"
          >
            <Icon icon={hasMemo ? 'MEMO' : 'MEMO_ADD'} />
          </button>

          <FormField
            name={`${targetName}.${index}.${typeName}`}
            initValue={adjustment[typeName]}
            setFieldValue={setFieldArrayValue}
            {...formHelper}
          >
            {({ name, ...inputHandlers }) => (
              <EnumProvider enumType={enumType}>
                {({ loading, error, data }) => {
                  if (loading) return null;
                  if (error) return `Error!: ${error}`;
                  return (
                    <SelectInput
                      {...inputHandlers}
                      onChange={newValue =>
                        inputHandlers.onChange({
                          target: {
                            value: newValue && newValue.name,
                          },
                        })
                      }
                      name={name}
                      items={data}
                      itemToString={item => (item ? item.description || item.name : '')}
                      itemToValue={item => (item ? item.name : '')}
                      renderSelect={({ ...rest }) => (
                        <DefaultSelect
                          {...rest}
                          align="left"
                          required
                          forceHoverStyle={isNew}
                          width="200px"
                          itemToString={item => (item ? item.description || item.name : '')}
                        />
                      )}
                      renderOptions={({ ...rest }) => (
                        <DefaultOptions
                          {...rest}
                          align="left"
                          items={data}
                          itemToString={item => (item ? item.description || item.name : '')}
                          itemToValue={item => (item ? item.name : '')}
                          width="200px"
                        />
                      )}
                    />
                  );
                }}
              </EnumProvider>
            )}
          </FormField>

          {valueInput}

          <button
            className={RemoveButtonStyle}
            onClick={() => {
              removeArrayItem(`${targetName}[${index}]`);
              formHelper.setFieldTouched(`${targetName}[${index}]`);
            }}
            type="button"
          >
            <Icon icon="REMOVE" />
          </button>
        </div>
        <div className={MemoSectionWrapperStyle(isMemoOpen)}>
          <div className={LastModifiedWrapperStyle}>
            <Label>LAST MODIFIED</Label>
            <GridRow gap="5px">
              <Display>
                <FormattedDate value={adjustment.updatedAt} />
              </Display>
              <div className={UserIconStyle}>
                <UserAvatar firstName="TODO" lastName="TODO" width="20px" height="20px" />
              </div>
            </GridRow>
          </div>
          <FormField
            name={`${targetName}.${index}.${memoName}`}
            initValue={adjustment[memoName]}
            setFieldValue={setFieldArrayValue}
            {...formHelper}
          >
            {({ name, ...inputHandlers }) => (
              <DefaultStyle
                type="textarea"
                isFocused={activeField === name}
                forceHoverStyle={isNew || !inputHandlers.value}
                width="360px"
                height="150px"
              >
                <TextAreaInput name={name} align="left" {...inputHandlers} />
              </DefaultStyle>
            )}
          </FormField>
        </div>
      </div>
    );
  }
}

export default DefaultAdjustmentStyle;
