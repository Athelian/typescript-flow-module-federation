// @flow
import React from 'react';
import { type Partner } from 'modules/partner/type.js.flow';
import FALLBACK_IMAGE from 'media/logo_fallback.jpg';
import Icon from 'components/Icon';
import BaseCard from '../BaseCard';
import {
  PartnerCardStyle,
  PartnerCardImageStyle,
  PartnerInfoWrapperStyle,
  PartnerNameStyle,
  PartnerTypesWrapperStyle,
  PartnerTypeStyle,
} from './style';

type OptionalProps = {
  onClick: Function,
  size: 'full' | 'half' | 'quarter',
  selectable: boolean,
  readOnly: boolean,
};

type Props = OptionalProps & {
  partner: ?Partner,
};

const defaultProps = {
  onClick: () => {},
  size: 'full',
  selectable: false,
  readOnly: false,
};

const PartnerCard = ({ partner, onClick, size, selectable, readOnly, ...rest }: Props) => {
  if (!partner) return '';

  const { name, types } = partner;

  const actions = selectable ? [] : [];

  return (
    <BaseCard
      {...rest}
      actions={actions}
      icon="PARTNER"
      color="PARTNER"
      selectable={selectable}
      readOnly={readOnly}
    >
      <div className={PartnerCardStyle(size)} role="presentation" onClick={onClick}>
        <img className={PartnerCardImageStyle} src={FALLBACK_IMAGE} alt="exporter_image" />
        <div className={PartnerInfoWrapperStyle(size)}>
          <div className={PartnerNameStyle}>{name}</div>
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
            <div className={PartnerTypeStyle(types && types.includes('Warehouse'))}>
              <Icon icon="WAREHOUSING" />
            </div>
          </div>
        </div>
      </div>
    </BaseCard>
  );
};

PartnerCard.defaultProps = defaultProps;

export default PartnerCard;
