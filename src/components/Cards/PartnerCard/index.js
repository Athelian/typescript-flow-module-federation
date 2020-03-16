// @flow
import * as React from 'react';
import type { Partner } from 'generated/graphql';
import FALLBACK_IMAGE from 'media/logo_fallback.jpg';
import Icon from 'components/Icon';
import { FullValueTooltip } from 'components/Tooltip';
import withForbiddenCard from 'hoc/withForbiddenCard';
import BaseCard from '../BaseCard';
import {
  PartnerCardStyle,
  PartnerCardImageStyle,
  PartnerInfoWrapperStyle,
  PartnerNameStyle,
  PartnerTypesWrapperStyle,
  PartnerTypeStyle,
  PartnerCodeStyle,
} from './style';

type Props = {|
  onClick: Function,
  size: 'full' | 'half' | 'quarter',
  selectable: boolean,
  readOnly: boolean,
  partner: Partner,
|};

const defaultProps = {
  onClick: () => {},
  size: 'full',
  selectable: false,
  readOnly: false,
};

const PartnerCard = ({ partner, onClick, size, selectable, ...rest }: Props) => {
  const actions = selectable ? [] : [];
  const types = partner?.partner?.types || partner?.types || [];
  const partnerName = partner?.partner?.name || partner?.name || partner?.organization?.name;

  return (
    <BaseCard actions={actions} icon="PARTNER" color="PARTNER" selectable={selectable} {...rest}>
      <div className={PartnerCardStyle(size)} role="presentation" onClick={onClick}>
        <img className={PartnerCardImageStyle} src={FALLBACK_IMAGE} alt="exporter_image" />
        <div className={PartnerInfoWrapperStyle(size)}>
          <FullValueTooltip message={partnerName}>
            <div className={PartnerNameStyle}>{partnerName}</div>
          </FullValueTooltip>
          <div className={PartnerCodeStyle}>{partner?.code}</div>
          <div className={PartnerTypesWrapperStyle(size)}>
            <div className={PartnerTypeStyle(types.includes('Importer'))}>
              <Icon icon="IMPORTER" />
            </div>
            <div className={PartnerTypeStyle(types.includes('Exporter'))}>
              <Icon icon="EXPORTER" />
            </div>
            <div className={PartnerTypeStyle(types.includes('Supplier'))}>
              <Icon icon="SUPPLIER" />
            </div>
            <div className={PartnerTypeStyle(types.includes('Forwarder'))}>
              <Icon icon="FORWARDER" />
            </div>
            <div className={PartnerTypeStyle(types.includes('Warehouser'))}>
              <Icon icon="WAREHOUSER" />
            </div>
          </div>
        </div>
      </div>
    </BaseCard>
  );
};

PartnerCard.defaultProps = defaultProps;

export default withForbiddenCard(PartnerCard, 'partner', {
  width: '195px',
  height: '215px',
  entityIcon: 'PARTNER',
  entityColor: 'PARTNER',
});
