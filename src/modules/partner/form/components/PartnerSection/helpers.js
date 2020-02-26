// @flow
import * as React from 'react';
import { PartnerCard, GrayCard } from 'components/Cards';
import GridRow from 'components/GridRow';
import GridColumn from 'components/GridColumn';
import { DashedPlusButton } from 'components/Form';

export const renderPartners = (organizations: Array<Object>, allowToUpdate: boolean) => {
  const num = organizations.length;

  if (num === 0) {
    if (allowToUpdate) {
      return <DashedPlusButton width="195px" height="215px" />;
    }
    return <GrayCard width="195px" height="215px" />;
  }
  if (num === 1) {
    return <PartnerCard partner={organizations[0]} readOnly={!allowToUpdate} />;
  }
  if (num === 2) {
    return (
      <GridColumn gap="10px">
        <PartnerCard partner={organizations[0]} size="half" readOnly={!allowToUpdate} />
        <PartnerCard partner={organizations[1]} size="half" readOnly={!allowToUpdate} />
      </GridColumn>
    );
  }
  if (num === 3) {
    return (
      <GridColumn gap="10px">
        <PartnerCard partner={organizations[0]} size="half" readOnly={!allowToUpdate} />
        <GridRow gap="10px">
          <PartnerCard partner={organizations[1]} size="quarter" readOnly={!allowToUpdate} />
          <PartnerCard partner={organizations[2]} size="quarter" readOnly={!allowToUpdate} />
        </GridRow>
      </GridColumn>
    );
  }
  if (num > 3) {
    return (
      <GridColumn gap="10px">
        <GridRow gap="10px">
          <PartnerCard partner={organizations[0]} size="quarter" readOnly={!allowToUpdate} />
          <PartnerCard partner={organizations[1]} size="quarter" readOnly={!allowToUpdate} />
        </GridRow>
        <GridRow gap="10px">
          <PartnerCard partner={organizations[2]} size="quarter" readOnly={!allowToUpdate} />
          <PartnerCard partner={organizations[3]} size="quarter" readOnly={!allowToUpdate} />
        </GridRow>
      </GridColumn>
    );
  }
  return '';
};

export default renderPartners;
