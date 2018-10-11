// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import Icon from 'components/Icon';
import UserAvatar from 'components/UserAvatar';
import FormattedDate from 'components/FormattedDate';
import GridRow from 'components/GridRow';
import { FormField } from 'modules/form';
import { textAreaFactory, selectEnumInputFactory } from 'modules/form/helpers';
import { Label, Display } from 'components/Form';
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
            saveOnChange
          >
            {({ name, ...inputHandlers }) =>
              selectEnumInputFactory({
                type: 'label',
                enumType,
                name,
                inputHandlers,
                isNew,
                originalValue: adjustment[typeName],
              })
            }
          </FormField>

          {valueInput}

          <button
            className={RemoveButtonStyle}
            onClick={() => {
              removeArrayItem(`${targetName}[${index}]`);
            }}
            type="button"
          >
            <Icon icon="REMOVE" />
          </button>
        </div>
        <div className={MemoSectionWrapperStyle(isMemoOpen)}>
          <div className={LastModifiedWrapperStyle}>
            <Label>
              <FormattedMessage id="components.form.lastModified" defaultMessage="LAST MODIFIED" />
            </Label>
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
          >
            {({ name, ...inputHandlers }) =>
              textAreaFactory({
                inputHandlers,
                name,
                isNew,
                originalValue: adjustment[memoName],
                width: '360px',
                height: '150px',
              })
            }
          </FormField>
        </div>
      </div>
    );
  }
}

export default DefaultAdjustmentStyle;
