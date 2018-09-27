// @flow
import * as React from 'react';
import { uniqBy } from 'lodash';
import { PartnerCard } from 'components/Cards';
import GridRow from 'components/GridRow';
import GridColumn from 'components/GridColumn';
import { DashedPlusButton } from 'components/Form';
import { ExporterEmptyCardStyle } from './style';

export const getUniqueExporters = (batches: Array<Object>) => {
  const uniqueExporters = uniqBy(
    batches.map(batch => batch.orderItem.productProvider.exporter),
    'id'
  );

  return uniqueExporters;
};

export const renderExporters = (exporters: Array<Object>) => {
  const numOfExporters = exporters.length;

  if (numOfExporters === 0) {
    return <div className={ExporterEmptyCardStyle} />;
  }
  if (numOfExporters === 1) {
    return <PartnerCard partner={exporters[0]} readOnly />;
  }
  if (numOfExporters === 2) {
    return (
      <GridColumn gap="10px">
        <PartnerCard partner={exporters[0]} size="half" readOnly />
        <PartnerCard partner={exporters[1]} size="half" readOnly />
      </GridColumn>
    );
  }
  if (numOfExporters === 3) {
    return (
      <GridColumn gap="10px">
        <PartnerCard partner={exporters[0]} size="half" readOnly />
        <GridRow gap="10px">
          <PartnerCard partner={exporters[1]} size="quarter" readOnly />
          <PartnerCard partner={exporters[2]} size="quarter" readOnly />
        </GridRow>
      </GridColumn>
    );
  }
  if (numOfExporters > 3) {
    return (
      <GridColumn gap="10px">
        <GridRow gap="10px">
          <PartnerCard partner={exporters[0]} size="quarter" readOnly />
          <PartnerCard partner={exporters[1]} size="quarter" readOnly />
        </GridRow>
        <GridRow gap="10px">
          <PartnerCard partner={exporters[2]} size="quarter" readOnly />
          <PartnerCard partner={exporters[3]} size="quarter" readOnly />
        </GridRow>
      </GridColumn>
    );
  }
  return '';
};

export const renderForwarders = (forwarders: Array<Object>) => {
  const numOfForwarders = forwarders.length;

  if (numOfForwarders === 0) {
    return <DashedPlusButton width="200px" height="230px" />;
  }
  if (numOfForwarders === 1) {
    return <PartnerCard partner={forwarders[0]} />;
  }
  if (numOfForwarders === 2) {
    return (
      <GridColumn gap="10px">
        <PartnerCard partner={forwarders[0]} size="half" />
        <PartnerCard partner={forwarders[1]} size="half" />
      </GridColumn>
    );
  }
  if (numOfForwarders === 3) {
    return (
      <GridColumn gap="10px">
        <PartnerCard partner={forwarders[0]} size="half" />
        <GridRow gap="10px">
          <PartnerCard partner={forwarders[1]} size="quarter" />
          <PartnerCard partner={forwarders[2]} size="quarter" />
        </GridRow>
      </GridColumn>
    );
  }
  if (numOfForwarders > 3) {
    return (
      <GridColumn gap="10px">
        <GridRow gap="10px">
          <PartnerCard partner={forwarders[0]} size="quarter" />
          <PartnerCard partner={forwarders[1]} size="quarter" />
        </GridRow>
        <GridRow gap="10px">
          <PartnerCard partner={forwarders[2]} size="quarter" />
          <PartnerCard partner={forwarders[3]} size="quarter" />
        </GridRow>
      </GridColumn>
    );
  }
  return '';
};
