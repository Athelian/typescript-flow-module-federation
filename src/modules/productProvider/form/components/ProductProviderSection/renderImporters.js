// @flow
import * as React from 'react';
import { ViewMoreCard, PartnerCard, GrayCard } from 'components/Cards';
import GridRow from 'components/GridRow';
import GridColumn from 'components/GridColumn';
import { DashedPlusButton } from 'components/Form';

const renderimporters = (importers: Array<Object>, allowToUpdate: boolean) => {
  const numOfimporters = importers?.length;

  if (numOfimporters === 0) {
    if (allowToUpdate) {
      return <DashedPlusButton width="195px" height="215px" />;
    }
    return <GrayCard width="195px" height="215px" />;
  }
  if (numOfimporters === 1) {
    return <PartnerCard partner={importers[0]} readOnly={!allowToUpdate} />;
  }
  if (numOfimporters === 2) {
    return (
      <GridColumn gap="10px">
        <PartnerCard partner={importers[0]} size="half" readOnly={!allowToUpdate} />
        <PartnerCard partner={importers[1]} size="half" readOnly={!allowToUpdate} />
      </GridColumn>
    );
  }
  if (numOfimporters === 3) {
    return (
      <GridColumn gap="10px">
        <PartnerCard partner={importers[0]} size="half" readOnly={!allowToUpdate} />
        <GridRow gap="10px">
          <PartnerCard partner={importers[1]} size="quarter" readOnly={!allowToUpdate} />
          <PartnerCard partner={importers[2]} size="quarter" readOnly={!allowToUpdate} />
        </GridRow>
      </GridColumn>
    );
  }
  if (numOfimporters > 3 && numOfimporters < 5) {
    return (
      <GridColumn gap="10px">
        <GridRow gap="10px">
          <PartnerCard partner={importers[0]} size="quarter" readOnly={!allowToUpdate} />
          <PartnerCard partner={importers[1]} size="quarter" readOnly={!allowToUpdate} />
        </GridRow>
        <GridRow gap="10px">
          <PartnerCard partner={importers[2]} size="quarter" readOnly={!allowToUpdate} />
          <PartnerCard partner={importers[3]} size="quarter" readOnly={!allowToUpdate} />
        </GridRow>
      </GridColumn>
    );
  }
  if (numOfimporters > 4) {
    return (
      <GridColumn gap="10px">
        <ViewMoreCard
          count={numOfimporters}
          partner={importers[0]}
          cardType="IMPORTER"
          readOnly={!allowToUpdate}
        />
      </GridColumn>
    );
  }
  return '';
};

export default renderimporters;
