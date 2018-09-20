// @flow
import * as React from 'react';
import VerticalTimeline from './VerticalTimeline';
import VerticalDates from './VerticalDates';
import { VerticalLayoutWrapperStyle } from './style';

type Props = {
  shipment: any,
};

class VerticalLayout extends React.PureComponent<Props> {
  render() {
    const { shipment } = this.props;
    return (
      <div className={VerticalLayoutWrapperStyle}>
        <VerticalTimeline shipment={shipment} />
        <VerticalDates shipment={shipment} />
      </div>
    );
  }
}

export default VerticalLayout;
