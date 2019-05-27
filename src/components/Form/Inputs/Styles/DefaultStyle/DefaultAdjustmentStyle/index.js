// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import Icon from 'components/Icon';
import UserAvatar from 'components/UserAvatar';
import FormattedDate from 'components/FormattedDate';
import GridRow from 'components/GridRow';
import { FormField } from 'modules/form';
import { Label, Display, EnumSelectInputFactory, TextAreaInputFactory } from 'components/Form';
import {
  AdjustmentWrapperStyle,
  AdjustmentFieldsWrapperStyle,
  MemoButtonStyle,
  RemoveButtonStyle,
  MemoSectionWrapperStyle,
  LastModifiedWrapperStyle,
  UserIconStyle,
  MemoStyle,
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

    const { updatedAt, updatedBy } = adjustment;

    const updatedByFirstName = updatedBy ? updatedBy.firstName : null;
    const updatedByLastName = updatedBy ? updatedBy.lastName : null;

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
            saveOnChange
          >
            {({ name, ...inputHandlers }) => (
              <EnumSelectInputFactory
                {...inputHandlers}
                enumType={enumType}
                editable={editable}
                name={name}
                type="label"
                inputAlign="left"
                hideTooltip
                required
              />
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
          {updatedAt && (
            <div className={LastModifiedWrapperStyle}>
              <Label>
                <FormattedMessage
                  id="components.form.lastModified"
                  defaultMessage="LAST MODIFIED"
                />
              </Label>
              <GridRow gap="5px">
                <Display>
                  <FormattedDate value={updatedAt} />
                </Display>
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
          )}

          <div className={MemoStyle}>
            <FormField
              name={`${targetName}.${index}.${memoName}`}
              initValue={adjustment[memoName]}
              setFieldValue={setFieldArrayValue}
            >
              {({ ...inputHandlers }) => (
                <TextAreaInputFactory
                  {...inputHandlers}
                  isNew
                  editable={editable}
                  inputWidth="360px"
                  inputHeight="150px"
                />
              )}
            </FormField>
          </div>
        </div>
      </div>
    );
  }
}

export default DefaultAdjustmentStyle;
