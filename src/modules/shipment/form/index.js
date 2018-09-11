// @flow
import * as React from 'react';
// import { Subscribe } from 'unstated';
// import { pickByProps } from 'utils/fp';
import { SectionWrapper, SectionHeader, LastModified } from 'components/Form';
// import OrderFormContainer from './container';
import ShipmentSection from './components/ShipmentSection';
import { ShipmentFormWrapperStyle } from './style';

type OptionalProps = {
  isNew: boolean,
};

type Props = OptionalProps & {
  shipment: Object,
  // onChangeStatus: Function,
};

const defaultProps = {
  isNew: false,
};

const ShipmentForm = ({ shipment, isNew }: Props) => (
  <div className={ShipmentFormWrapperStyle}>
    <SectionWrapper id="shipmentSection">
      <SectionHeader icon="SHIPMENT" title="SHIPMENT">
        {!isNew && <LastModified updatedAt={shipment.updatedAt} />}
      </SectionHeader>
      <ShipmentSection isNew={isNew} />
    </SectionWrapper>
  </div>
);

ShipmentForm.defaultProps = defaultProps;

export default ShipmentForm;
