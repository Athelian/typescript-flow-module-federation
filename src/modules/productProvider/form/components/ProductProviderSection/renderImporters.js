// @flow
import * as React from 'react';
import { PartnerCard, GrayCard } from 'components/Cards';
import GridRow from 'components/GridRow';
import GridColumn from 'components/GridColumn';
import { DashedPlusButton } from 'components/Form';

const renderExporters = (exporters: Array<Object>, allowToUpdate: boolean) => {
  const numOfexporters = exporters.length;

  if (numOfexporters === 0) {
    if (allowToUpdate) {
      return <DashedPlusButton width="195px" height="215px" />;
    }
    return <GrayCard width="195px" height="215px" />;
  }
  if (numOfexporters === 1) {
    return <PartnerCard partner={exporters[0]} readOnly={!allowToUpdate} />;
  }
  if (numOfexporters === 2) {
    return (
      <GridColumn gap="10px">
        <PartnerCard partner={exporters[0]} size="half" readOnly={!allowToUpdate} />
        <PartnerCard partner={exporters[1]} size="half" readOnly={!allowToUpdate} />
      </GridColumn>
    );
  }
  if (numOfexporters === 3) {
    return (
      <GridColumn gap="10px">
        <PartnerCard partner={exporters[0]} size="half" readOnly={!allowToUpdate} />
        <GridRow gap="10px">
          <PartnerCard partner={exporters[1]} size="quarter" readOnly={!allowToUpdate} />
          <PartnerCard partner={exporters[2]} size="quarter" readOnly={!allowToUpdate} />
        </GridRow>
      </GridColumn>
    );
  }
  if (numOfexporters > 3) {
    return (
      <GridColumn gap="10px">
        <GridRow gap="10px">
          <PartnerCard partner={exporters[0]} size="quarter" readOnly={!allowToUpdate} />
          <PartnerCard partner={exporters[1]} size="quarter" readOnly={!allowToUpdate} />
        </GridRow>
        <GridRow gap="10px">
          <PartnerCard partner={exporters[2]} size="quarter" readOnly={!allowToUpdate} />
          <PartnerCard partner={exporters[3]} size="quarter" readOnly={!allowToUpdate} />
        </GridRow>
        <GridRow gap="10px">
          {exporters[4] && (
            <PartnerCard partner={exporters[4]} size="quarter" readOnly={!allowToUpdate} />
          )}
          {exporters[5] && (
            <PartnerCard partner={exporters[5]} size="quarter" readOnly={!allowToUpdate} />
          )}
        </GridRow>
      </GridColumn>
    );
  }
  return '';
};

export default renderExporters;
