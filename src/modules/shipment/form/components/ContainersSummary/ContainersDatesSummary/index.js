// @flow
import React from 'react';
import { FormattedMessage } from 'react-intl';
import { isNullOrUndefined } from 'utils/fp';
import { Label, Display } from 'components/Form';
import FormattedDate from 'components/FormattedDate';
import { ContainerDatesSummaryStyle, ColumnWrapperStyle } from './style';

type OptionalProps = {
  agreedArrivalDateFrom: ?Date,
  agreedArrivalDateTo: ?Date,
  actualArrivalDateFrom: ?Date,
  actualArrivalDateTo: ?Date,
};

type Props = OptionalProps;

const defaultProps = {
  agreedArrivalDateFrom: null,
  agreedArrivalDateTo: null,
  actualArrivalDateFrom: null,
  actualArrivalDateTo: null,
};

const ContainersDatesSummary = ({
  agreedArrivalDateFrom,
  agreedArrivalDateTo,
  actualArrivalDateFrom,
  actualArrivalDateTo,
}: Props) => (
  <div className={ContainerDatesSummaryStyle}>
    <div className={ColumnWrapperStyle}>
      <Label>
        <FormattedMessage id="modules.Shipments.agreedArrival" defaultMessage="AGREED ARRIVAL" />
      </Label>
      <Label>
        <FormattedMessage id="modules.Shipments.actualArrival" defaultMessage="ACTUAL ARRIVAL" />
      </Label>
    </div>

    <div className={ColumnWrapperStyle}>
      <Label>
        <FormattedMessage id="modules.Shipments.from" defaultMessage="FROM" />
      </Label>
      {isNullOrUndefined(agreedArrivalDateFrom) ? (
        <Display color="GRAY_LIGHT" align="left">
          <FormattedMessage id="modules.Shipments.noDate" defaultMessage="No date" />
        </Display>
      ) : (
        <Display color="BLUE" align="left">
          <FormattedDate mode="datetime" value={agreedArrivalDateFrom} />
        </Display>
      )}
      {isNullOrUndefined(actualArrivalDateFrom) ? (
        <Display color="GRAY_LIGHT" align="left">
          <FormattedMessage id="modules.Shipments.noDate" defaultMessage="No date" />
        </Display>
      ) : (
        <Display color="TEAL" align="left">
          <FormattedDate mode="datetime" value={actualArrivalDateFrom} />
        </Display>
      )}
    </div>

    <div className={ColumnWrapperStyle}>
      <Label>
        <FormattedMessage id="modules.Shipments.to" defaultMessage="TO" />
      </Label>
      {isNullOrUndefined(agreedArrivalDateTo) ? (
        <Display color="GRAY_LIGHT" align="left">
          <FormattedMessage id="modules.Shipments.noDate" defaultMessage="No date" />
        </Display>
      ) : (
        <Display color="BLUE" align="left">
          <FormattedDate mode="datetime" value={agreedArrivalDateTo} />
        </Display>
      )}
      {isNullOrUndefined(actualArrivalDateTo) ? (
        <Display color="GRAY_LIGHT" align="left">
          <FormattedMessage id="modules.Shipments.noDate" defaultMessage="No date" />
        </Display>
      ) : (
        <Display color="TEAL" align="left">
          <FormattedDate mode="datetime" value={actualArrivalDateTo} />
        </Display>
      )}
    </div>
  </div>
);

ContainersDatesSummary.defaultProps = defaultProps;

export default ContainersDatesSummary;
