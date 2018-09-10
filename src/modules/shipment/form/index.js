// @flow
import * as React from 'react';
// import { Subscribe } from 'unstated';
// import { pickByProps } from 'utils/fp';
// import { SectionHeader, SectionWrapper } from 'components/Form';
// import OrderFormContainer from './container';
// import OrderSection from './components/OrderSection';
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

  return <div className={ShipmentFormWrapperStyle}>WIP {isNew}</div>;
};

ShipmentForm.defaultProps = defaultProps;

export default ShipmentForm;
