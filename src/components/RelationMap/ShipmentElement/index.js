// @flow
import * as React from 'react';
import ShipmentLabel from './ShipmentLabel';
import ShipmentTimeline from './ShipmentTimeline/TimelineLayout';
import { ShipmentCardWrapperStyle } from './style';

type Props = {
  shipment: Object,
};
class ShipmentElement extends React.PureComponent<Props> {
  render() {
    const { shipment } = this.props;
    return (
      <div className={ShipmentCardWrapperStyle}>
        <ShipmentLabel name={shipment.no} vol="123" />
        <ShipmentTimeline shipment={shipment} />
      </div>
    );
  }
}
export default ShipmentElement;
