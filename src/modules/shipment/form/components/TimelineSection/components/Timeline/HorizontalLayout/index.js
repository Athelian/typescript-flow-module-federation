// @flow
import * as React from 'react';
import HorizontalPortNames from './HorizontalPortNames';
import HorizontalTimeline from './HorizontalTimeline';
import HorizontalDates from './HorizontalDates';
import { HorizontalLayoutWrapperStyle } from './style';

type Props = {
  shipment: Object,
};

class HorizontalLayout extends React.PureComponent<Props> {
  render() {
    const { shipment } = this.props;
    return (
      <div className={HorizontalLayoutWrapperStyle}>
        <HorizontalPortNames shipment={shipment} />
        <HorizontalTimeline shipment={shipment} />
        <HorizontalDates shipment={shipment} />
      </div>
    );
  }
}

export default HorizontalLayout;
