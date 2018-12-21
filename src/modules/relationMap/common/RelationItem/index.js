// @flow
import * as React from 'react';
import BaseCard from 'components/Cards';
import { cx } from 'react-emotion';
// @TODO need to find other solution to manage tag
import { TagValue } from 'modules/relationMap/common/SortFilter/ToggleTag';
import {
  ORDER,
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
import Tags from 'components/RelationMap/OrderElement/Tags';
import ShipmentCard from 'components/RelationMap/ShipmentElement';
import ShipmentCollapsed from 'components/RelationMap/ShipmentElement/ShipmentCollapsed';

import { ItemWrapperStyle, ShipmentCardStyle, ShipmentCardTotalStyle } from './style';

type OptionalProps = {
  data: Object,
  isFocused: boolean,
  focusMode?: boolean,
  onClick: Function,
  onDoubleClick?: Function,
  actions: Array<React.Node>,
};

const defaultProps = {
  data: {},
  isFocused: false,
  focusMode: false,
  onClick: () => {},
  actions: [],
};

type Props = OptionalProps & {
  type: string,
};

// FIXME: never called
const RelationItem = (props: Props) => {
  const { type, data, onClick, isFocused, onDoubleClick, focusMode, actions } = props;
  if (typeof type === 'string' && /LINK-[0-4]/.test(type)) {
    const [, linkType] = type.split('-') || [];
    return (
      <RelationLine type={Number(linkType)} isFocused={isFocused} focusMode={focusMode || ''} />
    );
  }

  switch (type) {
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

RelationItem.defaultProps = defaultProps;

export default RelationItem;
