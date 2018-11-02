// @flow
import * as React from 'react';
import BaseCard from 'components/Cards';
import { cx } from 'react-emotion';
// @TODO need to find other solution to manage tag
import { TagValue } from 'modules/relationMap/common/ToggleTag';
import {
  ORDER,
  ORDER_HEADER,
  ORDER_ITEM,
  ORDER_ITEM_ALL,
  BATCH,
  BATCH_ALL,
  SHIPMENT,
  SHIPMENT_ALL,
} from 'modules/relationMap/constants';
import RelationLine from 'components/RelationMap/OrderElement/RelationLine';
import OrderCard from 'components/RelationMap/OrderElement/OrderCard';
import OrderItemCard from 'components/RelationMap/OrderElement/OrderItemCard';
import BatchCard from 'components/RelationMap/OrderElement/BatchCard';
import TotalCard from 'components/RelationMap/OrderElement/TotalCard';
import WrapperCard from 'components/RelationMap/OrderElement/WrapperCard';
import OrderHeader from 'components/RelationMap/OrderElement/OrderHeader';
import Tags from 'components/RelationMap/OrderElement/Tags';
import ShipmentCard from 'components/RelationMap/ShipmentElement';
import ShipmentHeader from 'components/RelationMap/ShipmentElement/ShipmentHeader';
import ShipmentCollapsed from 'components/RelationMap/ShipmentElement/ShipmentCollapsed';

import { ItemWrapperStyle, ShipmentCardStyle, ShipmentCardTotalStyle } from './style';

type OptionalProps = {
  data: Object,
  isCollapsed: boolean,
  isFocused: boolean,
  // hasRelation?: boolean,
  focusMode?: boolean,
  onClick: Function,
  onDoubleClick?: Function,
  actions: Array<React.Node>,
};

const defaultProps = {
  data: {},
  isCollapsed: false,
  isFocused: false,
  focusMode: false,
  onClick: () => {},
  actions: [],
};

type Props = OptionalProps & {
  type: string,
};

const Item = (props: Props) => {
  const {
    type,
    data,
    onClick,
    isFocused,
    // hasRelation,
    isCollapsed,
    onDoubleClick,
    focusMode,
    actions,
  } = props;
  if (typeof type === 'string' && /LINK-[0-4]/.test(type)) {
    const [, linkType] = type.split('-') || [];
    return (
      <RelationLine type={Number(linkType)} isFocused={isFocused} focusMode={focusMode || ''} />
    );
  }

  switch (type) {
    case ORDER_HEADER: {
      return <OrderHeader label={`ORDER ${data.id}`} isChecked />;
    }
    case ORDER: {
      return (
        <BaseCard
          showActionsOnHover
          icon={type}
          color={type}
          actions={actions}
          wrapperClassName={ItemWrapperStyle(isFocused, focusMode)}
        >
          <WrapperCard onDoubleClick={onDoubleClick}>
            <OrderCard order={data} />
            <TagValue>
              {({ value: isToggle }) => (isToggle ? <Tags dataSource={data.tags} /> : null)}
            </TagValue>
          </WrapperCard>
        </BaseCard>
      );
    }
    case ORDER_ITEM: {
      return (
        <BaseCard
          showActionsOnHover
          icon={type}
          color={type}
          actions={actions}
          wrapperClassName={ItemWrapperStyle(isFocused, focusMode)}
        >
          <OrderItemCard orderItem={data} />
        </BaseCard>
      );
    }
    case BATCH: {
      return (
        <BaseCard
          showActionsOnHover
          icon={type}
          color={type}
          actions={actions}
          wrapperClassName={ItemWrapperStyle(isFocused, focusMode)}
        >
          <WrapperCard onDoubleClick={onDoubleClick}>
            <BatchCard batch={data} />
            <TagValue>
              {({ value: isToggle }) => (isToggle ? <Tags dataSource={data.tags} /> : null)}
            </TagValue>
          </WrapperCard>
        </BaseCard>
      );
    }
    case ORDER_ITEM_ALL: {
      return (
        <BaseCard actions={[]} wrapperClassName={ItemWrapperStyle(isFocused, focusMode)}>
          <WrapperCard onClick={onClick}>
            <TotalCard name="Items" quantity={data.totalItem} />
          </WrapperCard>
        </BaseCard>
      );
    }
    case BATCH_ALL:
      return (
        <BaseCard wrapperClassName={ItemWrapperStyle(isFocused, focusMode)}>
          <WrapperCard onClick={onClick}>
            <TotalCard name="Batches" quantity={data.totalBatch} />
          </WrapperCard>
        </BaseCard>
      );
    case SHIPMENT: {
      return (
        <>
          <ShipmentHeader
            label={`SHIPMENT ${data.id}`}
            isChecked
            ordersNo={data.totalOrder}
            batchesNo={data.totalBatch}
            onToggle={onClick}
            isCollapsed={isCollapsed}
          />
          <BaseCard
            showActionsOnHover
            icon={type}
            color={type}
            actions={actions}
            wrapperClassName={cx(ItemWrapperStyle(isFocused), ShipmentCardStyle)}
          >
            <WrapperCard onDoubleClick={onDoubleClick} onClick={onClick}>
              <ShipmentCard shipment={data} />
              <TagValue>
                {({ value: isToggle }) => (isToggle ? <Tags dataSource={data.tags} /> : null)}
              </TagValue>
            </WrapperCard>
          </BaseCard>
        </>
      );
    }
    case SHIPMENT_ALL: {
      return (
        <>
          <ShipmentHeader
            label={`SHIPMENT ${data.id}`}
            isChecked
            ordersNo={data.totalOrder}
            batchesNo={data.totalBatch}
            onToggle={onClick}
            isCollapsed={isCollapsed}
          />
          <BaseCard
            showActionsOnHover
            icon="SHIPMENT"
            color="SHIPMENT"
            actions={actions}
            wrapperClassName={cx(ItemWrapperStyle(isFocused), ShipmentCardTotalStyle)}
          >
            <WrapperCard onClick={onClick}>
              <ShipmentCollapsed shipment={data} />
              <TagValue>
                {({ value: isToggle }) => (isToggle ? <Tags dataSource={data.tags} /> : null)}
              </TagValue>
            </WrapperCard>
          </BaseCard>
        </>
      );
    }
    default: {
      return <div />;
    }
  }
};

Item.defaultProps = defaultProps;

export default Item;
