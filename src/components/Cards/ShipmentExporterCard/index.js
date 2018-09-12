// @flow
import React from 'react';
import { type Partner } from 'modules/partner/type.js.flow';
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
  onClick: () => {},
  size: 'full',
};

const ShipmentExporterCard = ({ exporter, onClick, size, ...rest }: Props) => {
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

ShipmentExporterCard.defaultProps = defaultProps;

export default ShipmentExporterCard;
