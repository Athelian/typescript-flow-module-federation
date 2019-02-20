// @flow

import * as React from 'react';
import { noop } from 'lodash';
import { injectIntl, FormattedMessage } from 'react-intl';
import type { IntlShape } from 'react-intl';
import { cx } from 'react-emotion';
import { DefaultStyleWrapperStyle } from 'components/Form/Inputs/Styles/DefaultStyle/style';
import Tabs from 'components/NavBar/components/Tabs';
import { CardAction } from 'components/Cards/BaseCard';
import { NumberInput, Label, FormTooltip } from 'components/Form';
import messages from 'modules/relationMap/messages';
import * as style from '../style';
import * as splitStyle from './style';
import validator from './validator';

type Props = {
  intl: IntlShape,
  max: number,
  onSplit: ({
    type: string,
    quantity: number,
  }) => any,
};

const SIMPLE = 0;
const EQUALLY = 1;

function SplitPanel({ intl, onSplit, max }: Props) {
  const [activeTab, setActiveTab] = React.useState(SIMPLE);
  const [quantity, setQuantity] = React.useState(1);
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
  const validation = validator(activeTab + 1, max);
  return (
    <div className={style.ActionSection2WrapperStyle}>
      <div className={splitStyle.SplitTapWrapperStyle}>
        <Label width="120px">
          <FormattedMessage {...messages.splitType} />
        </Label>
        <Tabs
          tabs={tabs}
          activeIndex={activeTab}
          onChange={changeTab => {
            setActiveTab(changeTab);
            if (!activeTab) {
              if (quantity < 2) setQuantity(2);
            }
          }}
        />
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
              <NumberInput
                min={1}
                max={max}
                value={quantity}
                onChange={evt => setQuantity(evt.target.value)}
              />
              {!validation.isValidSync({
                quantity,
              }) && (
                <FormTooltip
                  isNew={false}
                  errorMessage={
                    <FormattedMessage
                      id="modules.RelationMap.split.validationError"
                      defaultMessage="Please enter the number between {min} and {max}"
                      values={{
                        min: activeTab + 1,
                        max,
                      }}
                    />
                  }
                />
              )}
            </div>
            <div className={splitStyle.SplitInputWrapperStyle}>
              <CardAction
                icon="ARROW_RIGHT"
                onClick={() =>
                  validation.isValidSync({
                    quantity,
                  })
                    ? onSplit({
                        type: 'batchSimpleSplit',
                        quantity,
                      })
                    : noop()
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
              <NumberInput
                min={1}
                max={max}
                value={quantity}
                onChange={evt => setQuantity(evt.target.value)}
              />
              {!validation.isValidSync({
                quantity,
              }) && (
                <FormTooltip
                  isNew={false}
                  errorMessage={
                    <FormattedMessage
                      id="modules.RelationMap.split.validationError"
                      defaultMessage="Please enter the number between {min} and {max}"
                      values={{
                        min: activeTab + 1,
                        max,
                      }}
                    />
                  }
                />
              )}
            </div>
            <div className={splitStyle.SplitInputWrapperStyle}>
              <CardAction
                icon="ARROW_RIGHT"
                onClick={() =>
                  validation.isValidSync({
                    quantity,
                  })
                    ? onSplit({
                        type: 'batchEqualSplit',
                        quantity,
                      })
                    : noop()
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
