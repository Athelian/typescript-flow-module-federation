// @flow
import * as React from 'react';
import { SnakeTimeline } from 'modules/shipment/form/components/TimelineSection/components/Timeline';
import { ShipmentCardWrapperStyle } from './style';

type Props = {
  shipment: Object,
};
class ShipmentElement extends React.PureComponent<Props> {
  render() {
    const { shipment } = this.props;
    return (
      <div className={ShipmentCardWrapperStyle}>
        <SnakeTimeline shipment={shipment} />
      </div>
    );
  }
}
export default ShipmentElement;
