// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import QuantityChart from 'components/QuantityChart';
import FormattedNumber from 'components/FormattedNumber';
import FormattedDate from 'components/FormattedDate';
import Icon from 'components/Icon';
import Tag from 'components/Tag';
import TaskRing from 'components/TaskRing';
import { Label, Display, FieldItem } from 'components/Form';
import withForbiddenCard from 'hoc/withForbiddenCard';
import { isForbidden } from 'utils/data';
import BaseCard from '../BaseCard';
import {
  OrderCardWrapperStyle,
  OrderInfoWrapperStyle,
  PONoWrapperStyle,
  ImporterWrapperStyle,
  DividerStyle,
  ChartWrapperStyle,
  TagsAndTaskWrapperStyle,
  TagsWrapperStyle,
} from './style';

type OptionalProps = {
  actions: Array<React.Node>,
  onClick: Function,
  onSelect: Function,
};

type Props = OptionalProps & {
  order: Object,
};

const defaultProps = {
  actions: [],
};

const OrderCard = ({ order, actions, onClick, onSelect, ...rest }: Props) => {
  const {
    archived,
    poNo,
    issuedAt,
    deliveryDate,
    totalPrice,
    totalOrdered,
    totalBatched,
    totalShipped,
    batchCount,
    batchShippedCount,
    orderItemCount,
    importer,
    exporter,
    todo,
  } = order;

  return (
    <BaseCard
      showBadge={order?.notificationUnseenCount > 0}
      icon="ORDER"
      color="ORDER"
      actions={actions}
      isArchived={archived}
      onSelect={() => {
        if (onSelect) {
          onSelect(order);
        }
      }}
      {...rest}
    >
      <div className={OrderCardWrapperStyle} onClick={onClick} role="presentation">
        <div className={OrderInfoWrapperStyle}>
          <div className={PONoWrapperStyle}>
            <Display align="left">{poNo}</Display>
          </div>
          <div className={ImporterWrapperStyle}>
            <Icon icon="IMPORTER" />
            {importer && importer.name}
          </div>
          <div className={ImporterWrapperStyle}>
            <Icon icon="EXPORTER" />
            {exporter && exporter.name}
          </div>
          <FieldItem
            label={
              <Label>
                <FormattedMessage id="components.cards.ttlPrice" defaultMessage="TTL PRICE" />
              </Label>
            }
            input={
              <Display>
                {totalPrice && (
                  <FormattedNumber value={totalPrice.amount} suffix={totalPrice.currency} />
                )}
              </Display>
            }
          />
          <FieldItem
            label={
              <Label>
                <FormattedMessage id="components.cards.ttlItems" defaultMessage="TTL ITEMS" />
              </Label>
            }
            input={
              <Display>
                <FormattedNumber value={orderItemCount} />
              </Display>
            }
          />
          <FieldItem
            label={
              <Label>
                <FormattedMessage id="components.cards.poDate" defaultMessage="PO DATE" />
              </Label>
            }
            input={
              <Display>
                <FormattedDate value={issuedAt} />
              </Display>
            }
          />
          <FieldItem
            label={
              <Label>
                <FormattedMessage
                  id="components.cards.contractDate"
                  defaultMessage="CONTRACT DATE"
                />
              </Label>
            }
            input={
              <Display>
                <FormattedDate value={deliveryDate} />
              </Display>
            }
          />
          <div className={DividerStyle} />
          <div className={ChartWrapperStyle}>
            <QuantityChart
              hasLabel={false}
              orderedQuantity={totalOrdered}
              batchedQuantity={totalBatched}
              shippedQuantity={totalShipped}
              batched={batchCount}
              shipped={batchShippedCount}
            />
          </div>
          <div className={TagsAndTaskWrapperStyle}>
            <div className={TagsWrapperStyle}>
              {((order && order.tags) || [])
                .filter(item => !isForbidden(item))
                .map(tag => (
                  <Tag key={tag.id} tag={tag} />
                ))}
            </div>
            <TaskRing {...todo} />
          </div>
        </div>
      </div>
    </BaseCard>
  );
};

OrderCard.defaultProps = defaultProps;

export default withForbiddenCard(React.memo(OrderCard), 'order', {
  width: '195px',
  height: '268px',
  entityIcon: 'ORDER',
  entityColor: 'ORDER',
});
