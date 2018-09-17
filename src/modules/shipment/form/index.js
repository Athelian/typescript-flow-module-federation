// @flow
import * as React from 'react';
import Loadable from 'react-loadable';
import LoadingIcon from 'components/LoadingIcon';
import { SectionWrapper, SectionHeader, LastModified } from 'components/Form';
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
  </div>
);

ShipmentForm.defaultProps = defaultProps;

export default ShipmentForm;
