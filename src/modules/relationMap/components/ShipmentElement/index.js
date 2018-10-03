// @flow
import * as React from 'react';
import ShipmentHeader from './ShipmentLabel';
import ShipmentTimeline from './ShipmentTimeline/TimelineLayout';
import { ShipmentElementWrapperStyle } from './style';

type Props = {
  shipment: Object,
};
class ShipmentElement extends React.PureComponent<Props> {
  render() {
    const { shipment } = this.props;
    return (
      <div className={ShipmentElementWrapperStyle}>
        <ShipmentHeader name={shipment.no} vol="" />
        <ShipmentTimeline shipment={shipment} />
      </div>
    );
  }
}
export default ShipmentElement;
