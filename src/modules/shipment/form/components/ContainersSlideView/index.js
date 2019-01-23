// @flow
import React from 'react';
import { isNullOrUndefined } from 'utils/fp';
import { earliest, latest } from 'utils/date';

import Layout from 'components/Layout';
import { SlideViewNavBar, EntityIcon } from 'components/NavBar';
import { SaveButton, CancelButton } from 'components/Buttons';

import Summary from './components/Summary';

type OptionalProps = {
  containers: Array<Object>,
};

type Props = OptionalProps & {
  onCancel: Function,
  onSave: Function,
};

function ContainersSlideView({ onCancel, onSave, containers }: Props) {
  const agreedArrivalDates = containers
    .map(({ warehouseArrivalAgreedDate }) => warehouseArrivalAgreedDate)
    .filter(item => !isNullOrUndefined(item))
    .map(item => new Date(item));

  const actualArrivalDates = containers
    .map(({ warehouseArrivalActualDate }) => warehouseArrivalActualDate)
    .filter(item => !isNullOrUndefined(item))
    .map(item => new Date(item));

  return (
    <Layout
      navBar={
        <SlideViewNavBar>
          <EntityIcon icon="CONTAINER" color="CONTAINER" />
          <CancelButton onClick={onCancel} />
          <SaveButton onClick={onSave} />
        </SlideViewNavBar>
      }
    >
      <Summary
        agreedArrivalDateFrom={earliest(agreedArrivalDates)}
        agreedArrivalDateTo={latest(agreedArrivalDates)}
        actualArrivalDateFrom={earliest(actualArrivalDates)}
        actualArrivalDateTo={latest(actualArrivalDates)}
        containers={containers}
        approvedAgreementSize={agreedArrivalDates.length}
        approvedConfirmationSize={actualArrivalDates.length}
      />
    </Layout>
  );
}

export default ContainersSlideView;
