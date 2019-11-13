// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { encodeId } from 'utils/id';
import Icon from 'components/Icon';
import Tag from 'components/Tag';
import FormattedDate from 'components/FormattedDate';
import FormattedNumber from 'components/FormattedNumber';
import { getLatestDate } from 'utils/shipment';
import { getByPathWithDefault } from 'utils/fp';
import withForbiddenCard from 'hoc/withForbiddenCard';
import RelateEntity from 'components/RelateEntity';
import TaskRing from 'components/TaskRing';
import { FieldItem, Label, Display } from 'components/Form';
import BaseCard from '../BaseCard';
import {
  ProductBatchCardWrapperStyle,
  BatchInfoWrapperStyle,
  BatchNoWrapperStyle,
  DividerStyle,
  OrderWrapperStyle,
  ShipmentWrapperStyle,
  ContainerWrapperStyle,
  WarehouseArrivalWrapperStyle,
  WarehouseArrivalIconStyle,
  ApprovalIconStyle,
  BatchTagsWrapperStyle,
  TagsLineStyle,
} from './style';

type Props = {|
  batch: Object,
  onClick: Function,
|};

const defaultProps = {
  onClick: () => {},
};

const ProductBatchCard = ({ batch, onClick, ...rest }: Props) => {
  const { no, latestQuantity, orderItem, shipment, container, todo } = batch;
  const order = getByPathWithDefault(null, 'order', orderItem);

  const hasContainers = shipment && shipment.containers && shipment.containers.length > 0;

  return (
    <BaseCard icon="BATCH" color="BATCH" {...rest}>
      <div className={ProductBatchCardWrapperStyle} onClick={onClick} role="presentation">
        <div className={BatchInfoWrapperStyle}>
          <div className={BatchNoWrapperStyle}>
            <Display align="left">{no}</Display>
          </div>

          <FieldItem
            label={
              <Label>
                <FormattedMessage id="components.cards.quantity" defaultMessage="QUANTITY" />
              </Label>
            }
            input={
              <Display>
                <FormattedNumber value={latestQuantity} />
              </Display>
            }
          />

          <div className={DividerStyle} />

          <div className={OrderWrapperStyle}>
            <RelateEntity
              link={order && order.id ? `/order/${encodeId(order.id)}` : ''}
              entity="ORDER"
              value={order && order.poNo}
            />
          </div>

          <div className={ShipmentWrapperStyle}>
            <RelateEntity
              link={shipment ? `/shipment/${encodeId(shipment.id)}` : ''}
              entity="SHIPMENT"
              value={shipment && shipment.no}
            />
          </div>

          <div className={ContainerWrapperStyle}>
            <RelateEntity
              link={container && container.id ? `/container/${encodeId(container.id)}` : ''}
              entity="CONTAINER"
              value={getByPathWithDefault(null, 'no', container)}
            />
          </div>

          {hasContainers ? (
            <>
              <div className={WarehouseArrivalWrapperStyle}>
                <div className={WarehouseArrivalIconStyle}>
                  <Icon icon="WAREHOUSE" />
                </div>
                <Label>
                  <FormattedMessage id="components.cards.agreed" defaultMessage="AGREED" />
                </Label>
                <Display align="left">
                  <FormattedDate
                    value={getByPathWithDefault(null, 'warehouseArrivalAgreedDate', container)}
                  />
                </Display>
                <div
                  className={ApprovalIconStyle(
                    !!getByPathWithDefault(false, 'warehouseArrivalAgreedDateApprovedAt', container)
                  )}
                >
                  <Icon icon="CHECKED" />
                </div>
              </div>

              <div className={WarehouseArrivalWrapperStyle}>
                <div className={WarehouseArrivalIconStyle}>
                  <Icon icon="WAREHOUSE" />
                </div>
                <Label>
                  <FormattedMessage id="components.cards.actual" defaultMessage="ACTUAL" />
                </Label>
                <Display align="left">
                  <FormattedDate
                    value={getByPathWithDefault(null, 'warehouseArrivalAgreedDate', container)}
                  />
                </Display>
                <div
                  className={ApprovalIconStyle(
                    !!getByPathWithDefault(false, 'warehouseArrivalActualDateApprovedAt', container)
                  )}
                >
                  <Icon icon="CHECKED" />
                </div>
              </div>
            </>
          ) : (
            <div className={WarehouseArrivalWrapperStyle}>
              <div className={WarehouseArrivalIconStyle}>
                <Icon icon="WAREHOUSE" />
              </div>
              <Label>
                <FormattedMessage id="components.cards.arrival" defaultMessage="ARRIVAL" />
              </Label>
              <Display align="left">
                <FormattedDate
                  value={getLatestDate(
                    getByPathWithDefault(null, 'containerGroups.0.warehouseArrival', shipment)
                  )}
                />
              </Display>
              <div
                className={ApprovalIconStyle(
                  !!getByPathWithDefault(
                    null,
                    'containerGroups.0.warehouseArrival.approvedAt',
                    shipment
                  )
                )}
              >
                <Icon icon="CHECKED" />
              </div>
            </div>
          )}
          <div className={TagsLineStyle}>
            <div className={BatchTagsWrapperStyle}>
              {batch.tags &&
                batch.tags.length > 0 &&
                batch.tags.map(tag => <Tag key={tag.id} tag={tag} />)}
            </div>
            <TaskRing {...todo} />
          </div>
        </div>
      </div>
    </BaseCard>
  );
};

ProductBatchCard.defaultProps = defaultProps;

export default withForbiddenCard(ProductBatchCard, 'batch', {
  width: '195px',
  height: '209px',
  entityIcon: 'BATCH',
  entityColor: 'BATCH',
});
