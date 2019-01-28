// @flow
import React from 'react';
import { earliest, latest } from 'utils/date';
import Layout from 'components/Layout';
import { SlideViewNavBar, EntityIcon } from 'components/NavBar';
import { SaveButton, CancelButton } from 'components/Buttons';
import { ShipmentContainerCard } from 'components/Cards';
import ContainersSummaryNavbar from './ContainersSummaryNavbar';
import { GridViewWrapperStyle } from './style';

type OptionalProps = {
  containers: Array<Object>,
  agreedArrivalDateFrom: Date,
  agreedArrivalDateTo: Date,
  actualArrivalDateFrom: Date,
  actualArrivalDateTo: Date,
  numOfContainers: number,
  numOfApprovedAgreed: number,
  numOfApprovedActual: number,
  onCancel: Function,
  onSave: Function,
};

type Props = OptionalProps;

const defaultProps = {
  onCancel: () => {},
  onSave: () => {},
};

const ContainersSlideView = ({
  containers,
  agreedArrivalDates,
  actualArrivalDates,
  onCancel,
  onSave,
  isDirty,
}: Props) => (
  <Layout
    navBar={
      <SlideViewNavBar>
        <EntityIcon icon="CONTAINER" color="CONTAINER" />
        <CancelButton onClick={onCancel} />
        <SaveButton disabled={!isDirty()} onClick={() => onSave(containers)} />
      </SlideViewNavBar>
    }
  >
    <ContainersSummaryNavbar
      agreedArrivalDateFrom={earliest(agreedArrivalDates)}
      agreedArrivalDateTo={latest(agreedArrivalDates)}
      actualArrivalDateFrom={earliest(actualArrivalDates)}
      actualArrivalDateTo={latest(actualArrivalDates)}
      numOfContainers={containers.length}
      numOfApprovedAgreed={agreedArrivalDates.length}
      numOfApprovedActual={actualArrivalDates.length}
    />
    <div className={GridViewWrapperStyle}>
      {containers.map(container => (
        <ShipmentContainerCard
          key={container.id}
          container={container}
          // update={newContainer => {
          //   setDeepFieldValue(`containers.${index}`, newContainer);
          // }}
        />
      ))}
    </div>
  </Layout>
);

ContainersSlideView.defaultProps = defaultProps;

export default ContainersSlideView;
