// @flow
import * as React from 'react';
// import { Subscribe } from 'unstated';
// import { pickByProps } from 'utils/fp';
import { SectionWrapper } from 'components/Form';
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

const ShipmentForm = ({ shipment, isNew }: Props) => {
  console.log(shipment);

  return (
    <div className={ShipmentFormWrapperStyle}>
      <SectionWrapper id="orderSection">
        <ShipmentSection isNew={isNew} />
      </SectionWrapper>
    </div>
  );
};

ShipmentForm.defaultProps = defaultProps;

export default ShipmentForm;
