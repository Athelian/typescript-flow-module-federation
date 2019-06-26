// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import Icon from 'components/Icon';
import { Tooltip } from 'components/Tooltip';
import GridColumn from 'components/GridColumn';
import { Display, Label } from 'components/Form';
import { BindedAndRelatedStyle, IconStyle } from './style';

type Props = {
  binding: {
    products: number,
    productProviders: number,
    orders: number,
    orderItems: number,
    batches: number,
    shipments: number,
    containers: number,
  },
  related: {
    products: number,
    productProviders: number,
    orders: number,
    orderItems: number,
    batches: number,
    shipments: number,
    containers: number,
  },
};

export default function BindingAndRelatedEntities({ binding, related }: Props) {
  return (
    <GridColumn gap="10px">
      <div className={BindedAndRelatedStyle}>
        <div />

        <Tooltip
          message={
            <FormattedMessage
              id="modules.Project.bindingEntities"
              defaultMessage="Binded Entities - Based on Entities binded to this Project"
            />
          }
        >
          <div>
            <Label align="center">
              <Icon icon="BINDED" />
            </Label>
          </div>
        </Tooltip>

        <Tooltip
          message={
            <FormattedMessage
              id="modules.Project.relatedEntities"
              defaultMessage="Unbinded Entities - Based on Entities of Tasks in this Project that are not binded to this Project"
            />
          }
        >
          <div>
            <Label align="center">
              <Icon icon="UNBINDED" />
            </Label>
          </div>
        </Tooltip>
      </div>

      <div className={BindedAndRelatedStyle}>
        <div className={IconStyle('ORDER')}>
          <Icon icon="ORDER" />
        </div>

        <Display align="center">{binding.orders}</Display>

        <Display align="center">{related.orders}</Display>
      </div>

      <div className={BindedAndRelatedStyle}>
        <div className={IconStyle('ORDER_ITEM')}>
          <Icon icon="ORDER_ITEM" />
        </div>

        <Display align="center">{binding.orderItems}</Display>

        <Display align="center">{related.orderItems}</Display>
      </div>

      <div className={BindedAndRelatedStyle}>
        <div className={IconStyle('BATCH')}>
          <Icon icon="BATCH" />
        </div>

        <Display align="center">{binding.batches}</Display>

        <Display align="center">{related.batches}</Display>
      </div>

      <div className={BindedAndRelatedStyle}>
        <div className={IconStyle('SHIPMENT')}>
          <Icon icon="SHIPMENT" />
        </div>

        <Display align="center">{binding.shipments}</Display>

        <Display align="center">{related.shipments}</Display>
      </div>

      <div className={BindedAndRelatedStyle}>
        <div className={IconStyle('PRODUCT')}>
          <Icon icon="PRODUCT" />
        </div>

        <Display align="center">{binding.products}</Display>

        <Display align="center">{related.products}</Display>
      </div>

      <div className={BindedAndRelatedStyle}>
        <div className={IconStyle('PRODUCT_PROVIDER')}>
          <Icon icon="PRODUCT_PROVIDER" />
        </div>

        <Display align="center">{binding.productProviders}</Display>

        <Display align="center">{related.productProviders}</Display>
      </div>
    </GridColumn>
  );
}
