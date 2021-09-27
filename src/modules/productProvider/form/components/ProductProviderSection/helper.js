// @flow
import * as React from 'react';
import { PartnerCard, GrayCard } from 'components/Cards';
import GridRow from 'components/GridRow';
import GridColumn from 'components/GridColumn';
import { DashedPlusButton } from 'components/Form';

export const generateName = (
  {
    name,
    type,
    entityName,
  }: {
    name: string,
    type: 'exporter' | 'supplier',
    entityName: string,
  },
  previousNames: { exporter: string, supplier: string }
) => {
  switch (type) {
    case 'exporter': {
      if (name.length === 0) return entityName;

      if (name.includes(previousNames.exporter)) {
        return name.replace(previousNames.exporter, entityName);
      }
      if (name.includes(previousNames.supplier)) {
        return `${entityName}-${name}`;
      }

      return name;
    }

    case 'supplier': {
      if (name.length === 0) return entityName;

      if (name.includes(previousNames.supplier)) {
        if (name.includes(previousNames.exporter) && entityName.length === 0) {
          return name.replace(`-${previousNames.supplier}`, '');
        }
        return name.replace(previousNames.supplier, entityName);
      }

      if (name.includes(previousNames.exporter)) {
        return `${name}-${entityName}`;
      }

      return name;
    }

    default:
      return name;
  }
};

export const renderPartners = (organizations: Array<Object>, allowToUpdate: boolean) => {
  const num = organizations?.length;

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
