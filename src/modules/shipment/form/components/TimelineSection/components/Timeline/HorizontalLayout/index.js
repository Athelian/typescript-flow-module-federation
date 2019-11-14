// @flow
import * as React from 'react';
import type { ShipmentPayload } from 'generated/graphql';
import PartnerPermissionsWrapper from 'components/PartnerPermissionsWrapper';
import { SHIPMENT_FORM } from 'modules/permission/constants/shipment';
import HorizontalPortNames from './HorizontalPortNames';
import HorizontalTimeline from './HorizontalTimeline';
import HorizontalDates from './HorizontalDates';
import { HorizontalLayoutWrapperStyle } from './style';

type Props = {|
  shipment: ShipmentPayload,
  navigable: boolean,
|};

const HorizontalLayout = ({ shipment, navigable }: Props) => {
  return (
    <PartnerPermissionsWrapper data={shipment}>
      {permissions => (
        <div className={HorizontalLayoutWrapperStyle}>
          <HorizontalPortNames shipment={shipment} />
          <HorizontalTimeline
            shipment={shipment}
            navigable={{
              form: navigable && permissions.includes(SHIPMENT_FORM),
            }}
          />
          <HorizontalDates shipment={shipment} />
        </div>
      )}
    </PartnerPermissionsWrapper>
  );
};

export default HorizontalLayout;
