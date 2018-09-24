// @flow
import * as React from 'react';
import { uniqBy } from 'lodash';
import { ShipmentExporterCard, ShipmentForwarderCard } from 'components/Cards';
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
    return <ShipmentExporterCard exporter={exporters[0]} />;
  }
  if (numOfExporters === 2) {
    return (
      <GridColumn gap="10px">
        <ShipmentExporterCard exporter={exporters[0]} size="half" />
        <ShipmentExporterCard exporter={exporters[1]} size="half" />
      </GridColumn>
    );
  }
  if (numOfExporters === 3) {
    return (
      <GridColumn gap="10px">
        <ShipmentExporterCard exporter={exporters[0]} size="half" />
        <GridRow gap="10px">
          <ShipmentExporterCard exporter={exporters[1]} size="quarter" />
          <ShipmentExporterCard exporter={exporters[2]} size="quarter" />
        </GridRow>
      </GridColumn>
    );
  }
  if (numOfExporters > 3) {
    return (
      <GridColumn gap="10px">
        <GridRow gap="10px">
          <ShipmentExporterCard exporter={exporters[0]} size="quarter" />
          <ShipmentExporterCard exporter={exporters[1]} size="quarter" />
        </GridRow>
        <GridRow gap="10px">
          <ShipmentExporterCard exporter={exporters[2]} size="quarter" />
          <ShipmentExporterCard exporter={exporters[3]} size="quarter" />
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
    return <ShipmentForwarderCard forwarder={forwarders[0]} />;
  }
  if (numOfForwarders === 2) {
    return (
      <GridColumn gap="10px">
        <ShipmentForwarderCard forwarder={forwarders[0]} size="half" />
        <ShipmentForwarderCard forwarder={forwarders[1]} size="half" />
      </GridColumn>
    );
  }
  if (numOfForwarders === 3) {
    return (
      <GridColumn gap="10px">
        <ShipmentForwarderCard forwarder={forwarders[0]} size="half" />
        <GridRow gap="10px">
          <ShipmentForwarderCard forwarder={forwarders[1]} size="quarter" />
          <ShipmentForwarderCard forwarder={forwarders[2]} size="quarter" />
        </GridRow>
      </GridColumn>
    );
  }
  if (numOfForwarders > 3) {
    return (
      <GridColumn gap="10px">
        <GridRow gap="10px">
          <ShipmentForwarderCard forwarder={forwarders[0]} size="quarter" />
          <ShipmentForwarderCard forwarder={forwarders[1]} size="quarter" />
        </GridRow>
        <GridRow gap="10px">
          <ShipmentForwarderCard forwarder={forwarders[2]} size="quarter" />
          <ShipmentForwarderCard forwarder={forwarders[3]} size="quarter" />
        </GridRow>
      </GridColumn>
    );
  }
  return '';
};
