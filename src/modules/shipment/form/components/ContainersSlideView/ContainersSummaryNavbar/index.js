// @flow
import React from 'react';
import { ContainersAmountSummary, ContainersDatesSummary } from 'modules/shipment/form/components';
import {
  ContainersSummaryNavbarWrapperStyle,
  LeftAreaWrapperStyle,
  RightAreaWrapperStyle,
} from './style';

type OptionalProps = {
  agreedArrivalDateFrom: ?Date,
  agreedArrivalDateTo: ?Date,
  actualArrivalDateFrom: ?Date,
  actualArrivalDateTo: ?Date,
};

type Props = OptionalProps & {
  numOfContainers: number,
  numOfApprovedAgreed: number,
  numOfApprovedActual: number,
};

const ContainersSummaryNavbar = ({
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
      <ContainersDatesSummary
        agreedArrivalDateFrom={agreedArrivalDateFrom}
        agreedArrivalDateTo={agreedArrivalDateTo}
        actualArrivalDateFrom={actualArrivalDateFrom}
        actualArrivalDateTo={actualArrivalDateTo}
      />
    </div>
    <div className={RightAreaWrapperStyle}>
      <ContainersAmountSummary
        numOfContainers={numOfContainers}
        numOfApprovedAgreed={numOfApprovedAgreed}
        numOfApprovedActual={numOfApprovedActual}
      />
    </div>
  </div>
);

export default ContainersSummaryNavbar;
