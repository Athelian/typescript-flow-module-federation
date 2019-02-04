// @flow
import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Label, Display } from 'components/Form';
import FormattedNumber from 'components/FormattedNumber';
import { ContainersAmountSummaryStyle, RowStyle } from './style';

type Props = {
  numOfContainers: number,
  numOfApprovedAgreed: number,
  numOfApprovedActual: number,
};

const ContainersAmountSummary = ({
  numOfContainers,
  numOfApprovedAgreed,
  numOfApprovedActual,
}: Props) => (
  <div className={ContainersAmountSummaryStyle}>
    <div className={RowStyle}>
      <Label>
        <FormattedMessage
          id="modules.Shipments.noOfContainers"
          defaultMessage="NO. OF CONTAINERS"
        />
      </Label>
      <Display>
        <FormattedNumber value={numOfContainers} />
      </Display>
    </div>

    <div className={RowStyle}>
      <Label>
        <FormattedMessage
          id="modules.Shipments.noOfApprovedAgreedDates"
          defaultMessage="NO. OF APPROVED AGREED DATES"
        />
      </Label>
      <Display color="BLUE">
        <FormattedNumber value={numOfApprovedAgreed} />
      </Display>
    </div>

    <div className={RowStyle}>
      <Label>
        <FormattedMessage
          id="modules.Shipments.noOfApprovedActualDates"
          defaultMessage="NO. OF APPROVED ACTUAL DATES"
        />
      </Label>
      <Display color="TEAL">
        <FormattedNumber value={numOfApprovedActual} />
      </Display>
    </div>
  </div>
);

export default ContainersAmountSummary;
