// @flow
import React from 'react';
import { FormattedMessage } from 'react-intl';
import { isNullOrUndefined } from 'utils/fp';
import { FieldItem, Label, Display } from 'components/Form';
import FormattedNumber from 'components/FormattedNumber';
import FormattedDate from 'components/FormattedDate';
import {
  ContainersSummaryNavbarWrapperStyle,
  LeftAreaWrapperStyle,
  ColumnWrapperStyle,
  RightAreaWrapperStyle,
} from './style';

type OptionalProps = {
  agreedArrivalDateFrom: Date,
  agreedArrivalDateTo: Date,
  actualArrivalDateFrom: Date,
  actualArrivalDateTo: Date,
};

type Props = OptionalProps & {
  numOfContainers: number,
  numOfApprovedAgreed: number,
  numOfApprovedActual: number,
};

const Summary = ({
  agreedArrivalDateFrom,
  agreedArrivalDateTo,
  actualArrivalDateFrom,
  actualArrivalDateTo,
  numOfContainers,
  numOfApprovedAgreed,
  numOfApprovedActual,
}: Props) => (
  <div className={ContainersSummaryNavbarWrapperStyle}>
    <div className={LeftAreaWrapperStyle}>
      <div className={ColumnWrapperStyle}>
        <Label>
          <FormattedMessage id="modules.shipment.agreedArrival" defaultMessage="AGREED ARRIVAL" />
        </Label>
        <Label>
          <FormattedMessage id="modules.shipment.actualArrival" defaultMessage="ACTUAL ARRIVAL" />
        </Label>
      </div>

      <div className={ColumnWrapperStyle}>
        <Label>
          <FormattedMessage id="modules.shipment.from" defaultMessage="FROM" />
        </Label>
        {isNullOrUndefined(agreedArrivalDateFrom) ? (
          <Display color="GRAY_LIGHT" align="left">
            <FormattedMessage id="modules.shipment.noDate" defaultMessage="No date" />
          </Display>
        ) : (
          <Display color="BLUE" align="left">
            <FormattedDate mode="datetime" value={agreedArrivalDateFrom} />
          </Display>
        )}
        {isNullOrUndefined(actualArrivalDateFrom) ? (
          <Display color="GRAY_LIGHT" align="left">
            <FormattedMessage id="modules.shipment.noDate" defaultMessage="No date" />
          </Display>
        ) : (
          <Display color="TEAL" align="left">
            <FormattedDate mode="datetime" value={actualArrivalDateFrom} />
          </Display>
        )}
      </div>

      <div className={ColumnWrapperStyle}>
        <Label>
          <FormattedMessage id="modules.shipment.to" defaultMessage="TO" />
        </Label>
        {isNullOrUndefined(agreedArrivalDateTo) ? (
          <Display color="GRAY_LIGHT" align="left">
            <FormattedMessage id="modules.shipment.noDate" defaultMessage="No date" />
          </Display>
        ) : (
          <Display color="BLUE" align="left">
            <FormattedDate mode="datetime" value={agreedArrivalDateTo} />
          </Display>
        )}
        {isNullOrUndefined(actualArrivalDateTo) ? (
          <Display color="GRAY_LIGHT" align="left">
            <FormattedMessage id="modules.shipment.noDate" defaultMessage="No date" />
          </Display>
        ) : (
          <Display color="TEAL" align="left">
            <FormattedDate mode="datetime" value={actualArrivalDateTo} />
          </Display>
        )}
      </div>
    </div>

    <div className={RightAreaWrapperStyle}>
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
  </div>
);

export default Summary;
