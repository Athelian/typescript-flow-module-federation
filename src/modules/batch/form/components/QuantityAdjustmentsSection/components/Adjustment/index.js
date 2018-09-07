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
  NumberInput,
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
  setFieldValue: Function,
  formHelper: any,
  values: any,
  validationRules: any,
  activeField: any,
};

type State = {
  isMemoOpen: boolean,
};

class Adjustment extends React.Component<Props, State> {
  static defaultProps = {
    isNew: false,
  };

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
      setFieldValue,
      formHelper,
      values,
      validationRules,
      activeField,
    } = this.props;
    const { isMemoOpen } = this.state;

    const hasMemo = !!adjustment.memo;

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
            name={`batchAdjustments.${index}.reason`}
            initValue={adjustment.reason}
            setFieldValue={setFieldValue}
            validationOnChange
            onValidate={newValue =>
              formHelper.onValidation({ ...values, ...newValue }, validationRules())
            }
            {...formHelper}
          >
            {({ name, ...inputHandlers }) => (
              <EnumProvider enumType="BatchAdjustmentReason">
                {({ loading, error, data }) => {
                  if (loading) return null;
                  if (error) return `Error!: ${error}`;
                  return (
                    <SelectInput
                      name={name}
                      {...inputHandlers}
                      items={data}
                      itemToString={item => (item ? item.name : '')}
                      itemToValue={item => (item ? item.name : '')}
                      renderSelect={({ ...rest }) => (
                        <DefaultSelect
                          {...rest}
                          align="left"
                          required
                          forceHoverStyle={isNew}
                          width="200px"
                          itemToString={item => (item ? item.name : '')}
                        />
                      )}
                      renderOptions={({ ...rest }) => (
                        <DefaultOptions
                          {...rest}
                          align="left"
                          items={data}
                          itemToString={item => (item ? item.name : '')}
                          itemToValue={item => (item ? item.name : '')}
                        />
                      )}
                    />
                  );
                }}
              </EnumProvider>
            )}
          </FormField>
          <FormField
            name={`batchAdjustments.${index}.quantity`}
            initValue={adjustment.quantity}
            validationOnChange
            onValidate={newValue =>
              formHelper.onValidation({ ...values, ...newValue }, validationRules())
            }
            setFieldValue={setFieldValue}
            {...formHelper}
          >
            {({ name, ...inputHandlers }) => (
              <DefaultStyle
                type="number"
                isFocused={activeField === name}
                forceHoverStyle={isNew}
                width="200px"
              >
                <NumberInput name={name} {...inputHandlers} />
              </DefaultStyle>
            )}
          </FormField>
          <button className={RemoveButtonStyle} onClick={() => {}} type="button">
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
                <UserAvatar profileUrl="" />
              </div>
            </GridRow>
          </div>
          <FormField
            name={`batchAdjustments.${index}.memo`}
            initValue={adjustment.memo}
            validationOnChange
            onValidate={newValue =>
              formHelper.onValidation({ ...values, ...newValue }, validationRules())
            }
            setFieldValue={setFieldValue}
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

export default Adjustment;
