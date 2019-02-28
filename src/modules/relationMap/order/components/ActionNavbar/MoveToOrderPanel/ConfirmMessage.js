// @flow
import React from 'react';
import { FormattedMessage } from 'react-intl';
import messages from 'modules/relationMap/messages';
import { ConfirmLabelStyle, CurrencyLabelStyle } from './style';

type Props = {
  selectAllBatch: boolean,
  hasSelectedOrderItem: boolean,
  hasDiffCurrency: boolean,
  baseCurrency: string,
  diffCurrency: string,
  totalDiff: number,
};

const ConfirmMessage = ({
  selectAllBatch,
  hasSelectedOrderItem,
  hasDiffCurrency,
  baseCurrency,
  diffCurrency,
  totalDiff,
}: Props) => {
  return (
    <>
      {hasSelectedOrderItem && !selectAllBatch && (
        <div className={ConfirmLabelStyle}>
          <FormattedMessage {...messages.deleteUnSelectBatch} />
        </div>
      )}
      {hasDiffCurrency && (
        <div className={ConfirmLabelStyle}>
          <FormattedMessage {...messages.diffCurrency} />
          <div className={CurrencyLabelStyle}>{baseCurrency}</div>
          {totalDiff === 1 && (
            <>
              <FormattedMessage {...messages.diffSingleCurrency} />
              <div className={CurrencyLabelStyle}>{diffCurrency}</div>
            </>
          )}
          {totalDiff > 1 && <FormattedMessage {...messages.diffMultipleCurrency} />}
          <FormattedMessage {...messages.diffCurrencyAction} />
        </div>
      )}
      <div className={ConfirmLabelStyle}>
        <FormattedMessage {...messages.areYouSure} />
      </div>
    </>
  );
};

export default ConfirmMessage;
