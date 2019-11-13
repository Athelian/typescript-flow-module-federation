// @flow
import React from 'react';
import { type Partner } from 'modules/partner/type.js.flow';
import FALLBACK_IMAGE from 'media/logo_fallback.jpg';
import Icon from 'components/Icon';
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
  const { name, types, partner: partnerInfo } = partner;

  const actions = selectable ? [] : [];

  return (
    <BaseCard actions={actions} icon="PARTNER" color="PARTNER" selectable={selectable} {...rest}>
      <div className={PartnerCardStyle(size)} role="presentation" onClick={onClick}>
        <img className={PartnerCardImageStyle} src={FALLBACK_IMAGE} alt="exporter_image" />
        <div className={PartnerInfoWrapperStyle(size)}>
          <div className={PartnerNameStyle}>{name}</div>
          <div className={PartnerCodeStyle}>{partnerInfo && partnerInfo.code}</div>
          <div className={PartnerTypesWrapperStyle(size)}>
            <div className={PartnerTypeStyle(types && types.includes('Importer'))}>
              <Icon icon="IMPORTER" />
            </div>
            <div className={PartnerTypeStyle(types && types.includes('Exporter'))}>
              <Icon icon="EXPORTER" />
            </div>
            <div className={PartnerTypeStyle(types && types.includes('Supplier'))}>
              <Icon icon="SUPPLIER" />
            </div>
            <div className={PartnerTypeStyle(types && types.includes('Forwarder'))}>
              <Icon icon="FORWARDER" />
            </div>
            <div className={PartnerTypeStyle(types && types.includes('Warehouser'))}>
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
