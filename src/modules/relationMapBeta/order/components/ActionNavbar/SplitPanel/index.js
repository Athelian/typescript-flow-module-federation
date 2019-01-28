// @flow

import * as React from 'react';
import { injectIntl, FormattedMessage } from 'react-intl';
import type { IntlShape } from 'react-intl';
import { cx } from 'react-emotion';
import { DefaultStyleWrapperStyle } from 'components/Form/Inputs/Styles/DefaultStyle/style';
import Tabs from 'components/NavBar/components/Tabs';
import { CardAction } from 'components/Cards/BaseCard';
import { NumberInput, Label } from 'components/Form';
import messages from 'modules/relationMap/messages';
import * as style from 'modules/relationMap/common/ActionPanel/style';
import * as splitStyle from './style';

type Props = {
  intl: IntlShape,
  onSplit: ({
    type: string,
    quantity: number,
  }) => any,
};

const SIMPLE = 0;
const EQUALLY = 1;

function SplitPanel({ intl, onSplit }: Props) {
  const [activeTab, setActiveTab] = React.useState(SIMPLE);
  const [quantity, setQuantity] = React.useState(0);
  const tabs = [
    {
      id: 'simple',
      icon: '',
      key: SIMPLE,
      label: intl.formatMessage(messages.splitSimple),
      className: style.TabItemWrapperStyle,
      disabled: false,
    },
    {
      id: 'equalty',
      icon: '',
      key: EQUALLY,
      label: intl.formatMessage(messages.splitEqually),
      className: style.TabItemWrapperStyle,
      disabled: false,
    },
  ];
  return (
    <div className={style.ActionSection2WrapperStyle}>
      <div className={splitStyle.SplitTapWrapperStyle}>
        <Label width="120px">
          <FormattedMessage {...messages.splitType} />
        </Label>
        <Tabs tabs={tabs} activeIndex={activeTab} onChange={changeTab => setActiveTab(changeTab)} />
      </div>
      <div className={splitStyle.SplitTypeWrapperStyle}>
        {activeTab === SIMPLE ? (
          <>
            <Label width="80px">
              <FormattedMessage {...messages.splitTo} />
            </Label>
            <div
              className={cx(
                DefaultStyleWrapperStyle({
                  type: 'number',
                  forceHoverStyle: true,
                  transparent: false,
                  disabled: false,
                  isFocused: false,
                  hasError: false,
                  width: '80px',
                  height: '20px',
                }),
                splitStyle.SplitInputWrapperStyle
              )}
            >
              <NumberInput value={quantity} onChange={evt => setQuantity(evt.target.value)} />
            </div>
            <div className={splitStyle.SplitInputWrapperStyle}>
              <CardAction
                icon="ARROW_RIGHT"
                onClick={() =>
                  onSplit({
                    type: 'batchSimpleSplit',
                    quantity,
                  })
                }
              />
            </div>
          </>
        ) : (
          <>
            <Label width="80px">
              <FormattedMessage {...messages.splitTo} />
            </Label>
            <div
              className={cx(
                DefaultStyleWrapperStyle({
                  type: 'number',
                  forceHoverStyle: true,
                  transparent: false,
                  disabled: false,
                  isFocused: false,
                  hasError: false,
                  width: '80px',
                  height: '20px',
                }),
                splitStyle.SplitInputWrapperStyle
              )}
            >
              <NumberInput value={quantity} onChange={evt => setQuantity(evt.target.value)} />
            </div>
            <div className={splitStyle.SplitInputWrapperStyle}>
              <CardAction
                icon="ARROW_RIGHT"
                onClick={() =>
                  onSplit({
                    type: 'batchEqualSplit',
                    quantity,
                  })
                }
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default injectIntl(SplitPanel);
