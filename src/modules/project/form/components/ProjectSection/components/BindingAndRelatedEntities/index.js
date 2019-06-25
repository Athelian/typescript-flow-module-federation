// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import Icon from 'components/Icon';
import { Tooltip } from 'components/Tooltip';
import { WrapperStyle, IconStyle } from './style';

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
    <div className={WrapperStyle}>
      <div>
        <Icon icon="INFO" />
      </div>
      <div>
        <Tooltip
          message={
            <FormattedMessage
              id="modules.Project.bindingEntities"
              defaultMessage="Binded Entities - Based on Entities binded to this Projec"
            />
          }
        >
          <div>
            <Icon icon="CONNECT" />
          </div>
        </Tooltip>
      </div>
      <div>
        <Tooltip
          message={
            <FormattedMessage
              id="modules.Project.relatedEntities"
              defaultMessage="Related Entities - Based on Tasks in this Project"
            />
          }
        >
          <div>
            <Icon icon="UNLINK" />
          </div>
        </Tooltip>
      </div>
      <div className={IconStyle('ORDER')}>
        <Icon icon="ORDER" />
      </div>
      <div>{binding.orders}</div>
      <div>{related.orders}</div>
      <div className={IconStyle('ORDER')}>
        <Icon icon="ORDER_ITEM" />
      </div>
      <div>{binding.orderItems}</div>
      <div>{related.orderItems}</div>
      <div className={IconStyle('BATCH')}>
        <Icon icon="BATCH" />
      </div>
      <div>{binding.batches}</div>
      <div>{related.batches}</div>
      <div className={IconStyle('SHIPMENT')}>
        <Icon icon="SHIPMENT" />
      </div>
      <div>{binding.shipments}</div>
      <div>{related.shipments}</div>
      <div className={IconStyle('PRODUCT')}>
        <Icon icon="PRODUCT" />
      </div>
      <div>{binding.products}</div>
      <div>{related.products}</div>
      <div className={IconStyle('PRODUCT_PROVIDER')}>
        <Icon icon="PRODUCT_PROVIDER" />
      </div>
      <div>{binding.productProviders}</div>
      <div>{related.productProviders}</div>
    </div>
  );
}
