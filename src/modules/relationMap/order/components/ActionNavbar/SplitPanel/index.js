// @flow

import * as React from 'react';
import { noop } from 'lodash';
import { injectIntl, FormattedMessage } from 'react-intl';
import type { IntlShape } from 'react-intl';
import Tabs from 'components/NavBar/components/Tabs';
import { NumberInput, Label, FormTooltip, DefaultStyle, FieldItem } from 'components/Form';
import { ApplyButton } from 'components/Buttons';
import Icon from 'components/Icon';
import messages from 'modules/relationMap/messages';
import {
  SplitPanelWrapperStyle,
  SplitOptionsWrapperStyle,
  SplitLabelWrapperStyle,
  SplitActionWrapperStyle,
} from './style';
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
      disabled: false,
    },
    {
      id: 'equally',
      icon: '',
      key: EQUALLY,
      label: intl.formatMessage(messages.splitEqually),
      disabled: false,
    },
  ];

  const validation = validator(activeTab + 1, max);

  return (
    <div className={SplitPanelWrapperStyle}>
      <div className={SplitOptionsWrapperStyle}>
        <div className={SplitLabelWrapperStyle}>
          <Icon icon="SPLIT" />
          <Label color="TEAL_DARK">
            <FormattedMessage {...messages.splitType} />
          </Label>
        </div>
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

      <div className={SplitActionWrapperStyle}>
        {activeTab === SIMPLE ? (
          <>
            <FieldItem
              label={
                <Label width="min-content" align="right">
                  <FormattedMessage
                    id="modules.RelationMaps.label.splitQuantityLabel"
                    defaultMessage="QUANTITY TO SPLIT INTO"
                  />
                </Label>
              }
              input={
                <DefaultStyle type="number" width="160px">
                  <NumberInput
                    min={1}
                    max={max}
                    value={quantity}
                    onChange={evt => setQuantity(evt.target.value)}
                    onBlur={evt => setQuantity(evt.target.value)}
                  />
                </DefaultStyle>
              }
              tooltip={
                <FormTooltip
                  isNew={false}
                  errorMessage={
                    !validation.isValidSync({ quantity }) && (
                      <FormattedMessage
                        id="modules.RelationMap.split.validationError"
                        defaultMessage="Please enter the number between {min} and {max}"
                        values={{
                          min: activeTab + 1,
                          max,
                        }}
                      />
                    )
                  }
                />
              }
            />
            <ApplyButton
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
          </>
        ) : (
          <>
            <FieldItem
              label={
                <Label width="min-content" align="right">
                  <FormattedMessage
                    id="modules.RelationMaps.label.splitEquallyLabel"
                    defaultMessage="NUMBER OF BATCHES"
                  />
                </Label>
              }
              input={
                <DefaultStyle type="number" width="160px">
                  <NumberInput
                    min={1}
                    max={max}
                    value={quantity}
                    onChange={evt => setQuantity(evt.target.value)}
                    onBlur={evt => setQuantity(evt.target.value)}
                  />
                </DefaultStyle>
              }
              tooltip={
                <FormTooltip
                  isNew={false}
                  errorMessage={
                    !validation.isValidSync({ quantity }) && (
                      <FormattedMessage
                        id="modules.RelationMap.split.validationError"
                        defaultMessage="Please enter the number between {min} and {max}"
                        values={{
                          min: activeTab + 1,
                          max,
                        }}
                      />
                    )
                  }
                />
              }
            />
            <ApplyButton
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
          </>
        )}
      </div>
    </div>
  );
}

export default injectIntl(SplitPanel);
