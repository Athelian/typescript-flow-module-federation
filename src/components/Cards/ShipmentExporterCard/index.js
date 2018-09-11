// @flow
import React from 'react';
import { navigate } from '@reach/router';
import { type Partner } from 'modules/partner/type.js.flow';
import { encodeId } from 'utils/id';
import FALLBACK_IMAGE from 'media/logo_fallback.jpg';
import BaseCard from '../BaseCard';
import { ExporterCardStyle, ExporterCardImageStyle, ExporterNameStyle } from './style';

type OptionalProps = {
  onClick: Function,
  size: 'full' | 'half' | 'quarter',
};

type Props = OptionalProps & {
  exporter: ?Partner,
};

const defaultProps = {
  onClick: id => navigate(`/partner/${encodeId(id)}`),
  size: 'full',
};

const PartnerCard = ({ exporter, onClick, size, ...rest }: Props) => {
  if (!exporter) return '';

  const { name } = exporter;

  return (
    <BaseCard {...rest} icon="PARTNER" color="PARTNER" readOnly>
      <div className={ExporterCardStyle(size)} role="presentation" onClick={onClick}>
        <img className={ExporterCardImageStyle} src={FALLBACK_IMAGE} alt="exporter_image" />
        <div className={ExporterNameStyle}>{name}</div>
      </div>
    </BaseCard>
  );
};

PartnerCard.defaultProps = defaultProps;

export default PartnerCard;
