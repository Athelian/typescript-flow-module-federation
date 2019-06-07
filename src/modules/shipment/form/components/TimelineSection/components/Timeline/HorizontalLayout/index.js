// @flow
import * as React from 'react';
import PartnerPermissionsWrapper from 'components/PartnerPermissionsWrapper';
import { SHIPMENT_FORM } from 'modules/permission/constants/shipment';
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
      <PartnerPermissionsWrapper data={shipment}>
        {permissions => (
          <div className={HorizontalLayoutWrapperStyle}>
            <HorizontalPortNames shipment={shipment} />
            <HorizontalTimeline
              shipment={shipment}
              navigable={{
                form: permissions.includes(SHIPMENT_FORM),
              }}
            />
            <HorizontalDates shipment={shipment} />
          </div>
        )}
      </PartnerPermissionsWrapper>
    );
  }
}

export default HorizontalLayout;
