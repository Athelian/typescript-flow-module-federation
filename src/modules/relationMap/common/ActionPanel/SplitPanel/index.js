// @flow
import * as React from 'react';
import { injectIntl, FormattedMessage } from 'react-intl';
import type { IntlShape } from 'react-intl';
import { cx } from 'react-emotion';
import Tabs from 'components/NavBar/components/Tabs';
import { TextInput, SelectInput, DefaultSelect, DefaultOptions, Label } from 'components/Form';
import { DefaultStyleWrapperStyle } from 'components/Form/Inputs/Styles/DefaultStyle/style';
import { CardAction } from 'components/Cards/BaseCard';
import messages from 'modules/relationMap/messages';
import { injectUid } from 'utils/id';
import * as style from '../style';
import * as splitStyle from './style';

type Props = {
  onApply: Function,
  intl: IntlShape,
  targetedItem: Object,
};

type State = {
  quantity: number,
  quantityType: string,
  tabIndex: number,
};

const SIMPLE = 0;
const EQUALLY = 1;
const BALANCE = 2;

const getInitialState = () => ({
  quantity: 0,
  quantityType: 'integer',
  tabIndex: SIMPLE,
});

const defaultInputOption = {
  type: 'number',
  forceHoverStyle: true,
  transparent: false,
  disabled: false,
  isFocused: false,
  hasError: false,
  width: '80px',
  height: '20px',
};

const isDisabledSimpleAndEquallySplit = targetedItem => {
  const { orderItem = {}, batch = {} } = targetedItem;
  return Object.keys(orderItem).length > 0 || !(Object.keys(batch).length === 1);
};

const isDisabledBalanceSplit = targetedItem => {
  const { orderItem = {}, batch = {} } = targetedItem;
  return Object.keys(batch).length > 0 || !(Object.keys(orderItem).length === 1);
};
class SplitPanel extends React.Component<Props, State> {
  state = getInitialState();

  onChangeTab = tabIndex => {
    this.setState({ ...getInitialState(), tabIndex });
  };

  onChangeQuantity = e => {
    const quantity = e.target.value;
    this.setState({ quantity });
  };

  onChangeQuantityType = e => {
    const quantityType = e.value;
    this.setState({ quantityType });
  };

  onApply = () => {
    const { onApply } = this.props;
    onApply(this.state);
  };

  render() {
    const { tabIndex, quantity } = this.state;
    const { intl, targetedItem } = this.props;
    const disabledBatchSplit = isDisabledSimpleAndEquallySplit(targetedItem);
    const disabledBalanceSplit = isDisabledBalanceSplit(targetedItem);
    const tabs = [
      {
        key: SIMPLE,
        label: intl.formatMessage(messages.splitSimple),
        className: style.TabItemWrapperStyle,
        disabled: disabledBatchSplit,
      },
      {
        key: EQUALLY,
        label: intl.formatMessage(messages.splitEqually),
        className: style.TabItemWrapperStyle,
        disabled: disabledBatchSplit,
      },
      {
        key: BALANCE,
        label: intl.formatMessage(messages.splitBalance),
        className: style.TabItemWrapperStyle,
        disabled: disabledBalanceSplit,
      },
    ];
    return (
      <div className={style.ActionSection2WrapperStyle}>
        <div className={splitStyle.SplitTapWrapperStyle}>
          <Label width="120px">
            <FormattedMessage {...messages.splitType} />
          </Label>
          <Tabs tabs={tabs.map(injectUid)} onChange={this.onChangeTab} />
        </div>
        <div className={splitStyle.SplitTypeWrapperStyle}>
          {tabIndex === SIMPLE && !disabledBatchSplit && (
            <>
              <Label width="80px">
                <FormattedMessage {...messages.splitTo} />
              </Label>
              <div
                className={cx(
                  DefaultStyleWrapperStyle(defaultInputOption),
                  splitStyle.SplitInputWrapperStyle
                )}
              >
                <TextInput value={quantity} onChange={this.onChangeQuantity} />
              </div>
              <div className={splitStyle.SplitInputWrapperStyle}>
                <CardAction icon="ARROW_RIGHT" onClick={this.onApply} />
              </div>
            </>
          )}
          {tabIndex === EQUALLY && !disabledBatchSplit && (
            <>
              <Label width="80px">
                <FormattedMessage {...messages.splitTo} />
              </Label>
              <div className={splitStyle.SplitInputWrapperStyle}>
                <SelectInput
                  onChange={this.onChangeQuantityType}
                  items={[
                    { title: 'Integer', value: 'integer' },
                    { title: 'Double', value: 'double' },
                  ]}
                  itemToString={v => (v ? v.title : '')}
                  itemToValue={v => (v ? v.value : null)}
                  renderSelect={({ ...rest }) => (
                    <DefaultSelect {...rest} required align="left" width="120px" height="20px" />
                  )}
                  renderOptions={({ ...rest }) => (
                    <DefaultOptions {...rest} align="left" width="120px" height="20px" />
                  )}
                />
              </div>
              <div
                className={cx(
                  DefaultStyleWrapperStyle(defaultInputOption),
                  splitStyle.SplitInputWrapperStyle
                )}
              >
                <TextInput value={quantity} onChange={this.onChangeQuantity} />
              </div>
              <div className={splitStyle.SplitInputWrapperStyle}>
                <CardAction icon="ARROW_RIGHT" onClick={this.onApply} />
              </div>
            </>
          )}
          {tabIndex === BALANCE && !disabledBalanceSplit && (
            <CardAction icon="ARROW_RIGHT" onClick={this.onApply} />
          )}
        </div>
      </div>
    );
  }
}
export default injectIntl(SplitPanel);
