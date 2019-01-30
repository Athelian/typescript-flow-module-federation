// @flow
import React from 'react';
import { FormattedMessage } from 'react-intl';
import { FieldItem, Label, Display } from 'components/Form';
import FormattedNumber from 'components/FormattedNumber';
import { ContainersAmountSummaryStyle } from './style';

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
    <FieldItem
      label={
        <Label>
          <FormattedMessage
            id="modules.shipment.noOfContainers"
            defaultMessage="NO. OF CONTAINERS"
          />
        </Label>
      }
      input={
        <Display>
          <FormattedNumber value={numOfContainers} />
        </Display>
      }
    />
    <FieldItem
      label={
        <Label>
          <FormattedMessage
            id="modules.shipment.noOfApprovedAgreedDates"
            defaultMessage="NO. OF APPROVED AGREED DATES"
          />
        </Label>
      }
      input={
        <Display color="BLUE">
          <FormattedNumber value={numOfApprovedAgreed} />
        </Display>
      }
    />
    <FieldItem
      label={
        <Label>
          <FormattedMessage
            id="modules.shipment.noOfApprovedActualDates"
            defaultMessage="NO. OF APPROVED ACTUAL DATES"
          />
        </Label>
      }
      input={
        <Display color="TEAL">
          <FormattedNumber value={numOfApprovedActual} />
        </Display>
      }
    />
  </div>
);

export default ContainersAmountSummary;
