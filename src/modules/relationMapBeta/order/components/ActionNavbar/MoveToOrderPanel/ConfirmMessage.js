// @flow
import React from 'react';
import { Label } from 'components/Form';
import { FormattedMessage } from 'react-intl';
import messages from 'modules/relationMap/messages';
import { ConfirmLabelStyle, CurrencyLabelStyle } from './style';

type Props = {
  selectAllBatch: boolean,
  hasDiffCurrency: boolean,
  baseCurrency: string,
  diffCurrency: string,
  totalDiff: number,
};

const ConfirmMessage = ({
  selectAllBatch,
  hasDiffCurrency,
  baseCurrency,
  diffCurrency,
  totalDiff,
}: Props) => {
  if (selectAllBatch && !hasDiffCurrency) {
    return (
      <Label className={ConfirmLabelStyle} align="center">
        <FormattedMessage {...messages.areYouSure} />
      </Label>
    );
  }
  return (
    <div>
      {selectAllBatch && (
        <Label className={ConfirmLabelStyle} align="center">
          <FormattedMessage {...messages.deleteUnSelectBatch} />
        </Label>
      )}
      {hasDiffCurrency && (
        <Label className={ConfirmLabelStyle} align="center">
          <FormattedMessage {...messages.diffCurrency} />
          <Label className={CurrencyLabelStyle} align="center">
            {baseCurrency}
          </Label>
          {totalDiff === 1 && (
            <Label align="center">
              <FormattedMessage {...messages.diffSingleCurrency} />
              <Label className={CurrencyLabelStyle} align="center">
                {diffCurrency}
              </Label>
            </Label>
          )}
          {totalDiff > 1 && <FormattedMessage {...messages.diffMultipleCurrency} />}
          <FormattedMessage {...messages.diffCurrencyAction} />
          <FormattedMessage {...messages.areYouSure} />
        </Label>
      )}
    </div>
  );
};

export default ConfirmMessage;
