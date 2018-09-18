// @flow
import * as React from 'react';
import Loadable from 'react-loadable';
import { uniqBy } from 'lodash';
import { Subscribe } from 'unstated';
import LoadingIcon from 'components/LoadingIcon';
import { SectionWrapper, SectionHeader, LastModified } from 'components/Form';
import { ShipmentBatchesContainer } from './containers';
import ShipmentSection from './components/ShipmentSection';
import { ShipmentFormWrapperStyle } from './style';

type OptionalProps = {
  isNew: boolean,
};

type Props = OptionalProps & {
  shipment: Object,
};

const defaultProps = {
  isNew: false,
};

const AsyncTimelineSection = Loadable({
  loading: LoadingIcon,
  loader: () => import('./components/TimelineSection'),
});
const AsyncCargoSection = Loadable({
  loading: LoadingIcon,
  loader: () => import('./components/CargoSection'),
});
const AsyncOrderSection = Loadable({
  loading: LoadingIcon,
  loader: () => import('./components/OrderSection'),
});

const ShipmentForm = ({ shipment, isNew }: Props) => (
  <div className={ShipmentFormWrapperStyle}>
    <SectionWrapper id="shipmentSection">
      <SectionHeader icon="SHIPMENT" title="SHIPMENT">
        {!isNew && <LastModified updatedAt={shipment.updatedAt} updatedBy={shipment.updatedBy} />}
      </SectionHeader>
      <ShipmentSection isNew={isNew} />
    </SectionWrapper>
    <SectionWrapper id="timelineSection">
      <SectionHeader icon="TIMELINE" title="TIMELINE" />
      <AsyncTimelineSection isNew={isNew} />
    </SectionWrapper>
    <SectionWrapper id="cargoSection">
      <Subscribe to={[ShipmentBatchesContainer]}>
        {({ state: { batches } }) => (
          <SectionHeader icon="CARGO" title={`CARGO (${batches.length})`} />
        )}
      </Subscribe>
      <AsyncCargoSection />
    </SectionWrapper>
    <SectionWrapper id="orderSection">
      <Subscribe to={[ShipmentBatchesContainer]}>
        {({ state: { batches } }) => {
          const uniqueOrders = uniqBy(batches.map(item => item.orderItem.order), 'id');
          return (
            <>
              <SectionHeader icon="ORDER" title={`ORDER (${uniqueOrders.length})`} />
              <AsyncOrderSection orders={uniqueOrders} />
            </>
          );
        }}
      </Subscribe>
    </SectionWrapper>
  </div>
);

ShipmentForm.defaultProps = defaultProps;

export default ShipmentForm;
