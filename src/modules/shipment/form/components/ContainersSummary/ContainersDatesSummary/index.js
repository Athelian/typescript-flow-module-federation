// @flow
import React from 'react';
import { FormattedMessage } from 'react-intl';
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
      {agreedArrivalDateFrom ? (
        <Display color="BLUE" align="left">
          <FormattedDate mode="datetime" value={agreedArrivalDateFrom} />
        </Display>
      ) : (
        <Display color="GRAY_LIGHT" align="left">
          <FormattedMessage id="modules.Shipments.noDate" defaultMessage="No date" />
        </Display>
      )}
      {actualArrivalDateFrom ? (
        <Display color="TEAL" align="left">
          <FormattedDate mode="datetime" value={actualArrivalDateFrom} />
        </Display>
      ) : (
        <Display color="GRAY_LIGHT" align="left">
          <FormattedMessage id="modules.Shipments.noDate" defaultMessage="No date" />
        </Display>
      )}
    </div>

    <div className={ColumnWrapperStyle}>
      <Label>
        <FormattedMessage id="modules.Shipments.to" defaultMessage="TO" />
      </Label>
      {agreedArrivalDateTo ? (
        <Display color="BLUE" align="left">
          <FormattedDate mode="datetime" value={agreedArrivalDateTo} />
        </Display>
      ) : (
        <Display color="GRAY_LIGHT" align="left">
          <FormattedMessage id="modules.Shipments.noDate" defaultMessage="No date" />
        </Display>
      )}
      {actualArrivalDateTo ? (
        <Display color="TEAL" align="left">
          <FormattedDate mode="datetime" value={actualArrivalDateTo} />
        </Display>
      ) : (
        <Display color="GRAY_LIGHT" align="left">
          <FormattedMessage id="modules.Shipments.noDate" defaultMessage="No date" />
        </Display>
      )}
    </div>
  </div>
);

ContainersDatesSummary.defaultProps = defaultProps;

export default ContainersDatesSummary;
