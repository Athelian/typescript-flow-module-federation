// @flow
import * as React from 'react';
import BaseCard from 'components/Cards';
import { cx } from 'react-emotion';
import ShipmentHeader from 'modules/relationMap/components/ShipmentElement/ShipmentHeader';

import RelationLine from './RelationLine';
import { ItemWrapperStyle, ShipmentCardStyle, ShipmentCardTotalStyle } from './style';
import OrderCard from './OrderCard';
import OrderItemCard from './OrderItemCard';
import BatchCard from './BatchCard';
import TotalCard from './TotalCard';
import WrapperCard from './WrapperCard';
import OrderHeader from './OrderHeader';
import Tags from './Tags';
import ShipmentCard from '../ShipmentElement';
import { TagValue } from '../ToggleTag';

type OptionalProps = {
  data: Object,
  isCollapsed: boolean,
  isFocused: boolean,
  onClick: Function,
  onDoubleClick?: Function,
  onMouseEnter: Function,
  onMouseLeave: Function,
};

const defaultProps = {
  data: {},
  isCollapsed: false,
  onClick: () => {},
};

type Props = OptionalProps & {
  type: string,
};

const Item = (props: Props) => {
  const { type, data, onClick, isFocused, onMouseEnter, onMouseLeave, onDoubleClick } = props;
  let render = <div />;
  switch (type) {
    case 'TAGS': {
      const templateDS = [
        {
          name: 'July ~ Aug',
          color: 'ORDER',
        },
        {
          name: 'Urgent',
          color: 'URGENT',
        },
      ];
      render = (
        <TagValue>
          {({ value: isToggle }) => (isToggle ? <Tags dataSource={templateDS} /> : null)}
        </TagValue>
      );
      break;
    }
    case 'ORDER_HEADER': {
      render = (
        <WrapperCard onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
          <OrderHeader label={`ORDER ${data.id}`} isChecked onToggle={() => {}} />
        </WrapperCard>
      );
      break;
    }
    case 'ORDER': {
      render = (
        <BaseCard
          icon={type}
          color={type}
          actions={[]}
          wrapperClassName={ItemWrapperStyle(isFocused)}
        >
          <WrapperCard
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            onDoubleClick={onDoubleClick}
          >
            <OrderCard
              info={data.info}
              orderedQuantity={data.orderedQuantity}
              batchedQuantity={data.batchedQuantity}
              shippedQuantity={data.shippedQuantity}
            />
            <TagValue>
              {({ value: isToggle }) => (isToggle ? <Tags dataSource={data.tags} /> : null)}
            </TagValue>
          </WrapperCard>
        </BaseCard>
      );
      break;
    }
    case 'ORDER_ITEM': {
      render = (
        <BaseCard
          icon={type}
          color={type}
          actions={[]}
          wrapperClassName={ItemWrapperStyle(isFocused)}
        >
          <WrapperCard onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
            <OrderItemCard
              info={data.info}
              orderedQuantity={data.orderedQuantity}
              batchedQuantity={data.batchedQuantity}
              shippedQuantity={data.shippedQuantity}
            />
          </WrapperCard>
        </BaseCard>
      );
      break;
    }
    case 'BATCH': {
      render = (
        <BaseCard
          icon={type}
          color={type}
          actions={[]}
          wrapperClassName={ItemWrapperStyle(isFocused)}
        >
          <WrapperCard
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            onDoubleClick={onDoubleClick}
          >
            <BatchCard
              title={data.title}
              quantity={data.quantity}
              volume={data.volume}
              deliveredAt={data.deliveredAt}
            />
            <TagValue>
              {({ value: isToggle }) => (isToggle ? <Tags dataSource={data.tags} /> : null)}
            </TagValue>
          </WrapperCard>
        </BaseCard>
      );
      break;
    }
    case 'ORDER_ITEM_ALL': {
      render = (
        <BaseCard actions={[]} wrapperClassName={ItemWrapperStyle(isFocused)}>
          <WrapperCard onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave} onClick={onClick}>
            <TotalCard name="Items" quantity={data.totalItem} />
          </WrapperCard>
        </BaseCard>
      );
      break;
    }
    case 'BATCH_ALL':
      render = (
        <BaseCard wrapperClassName={ItemWrapperStyle(isFocused)}>
          <WrapperCard onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave} onClick={onClick}>
            <TotalCard name="Batches" quantity={data.totalBatch} />
          </WrapperCard>
        </BaseCard>
      );
      break;
    case 'SHIPMENT': {
      render = (
        <BaseCard
          icon={type}
          color={type}
          wrapperClassName={cx(ItemWrapperStyle(isFocused), ShipmentCardStyle)}
        >
          <WrapperCard
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            onDoubleClick={onDoubleClick}
            onClick={onClick}
          >
            <ShipmentHeader
              label={`SHIPMENT ${data.id}`}
              isChecked
              ordersNo={data.numberOfOrder}
              batchesNo={data.numberOfBatch}
              onToggle={() => {}}
            />
            <ShipmentCard shipment={data} />
            <TagValue>
              {({ value: isToggle }) => (isToggle ? <Tags dataSource={data.tags} /> : null)}
            </TagValue>
          </WrapperCard>
        </BaseCard>
      );
      break;
    }
    case 'SHIPMENT_ALL': {
      render = (
        <BaseCard
          icon={type}
          color={type}
          actions={[]}
          wrapperClassName={cx(ItemWrapperStyle(isFocused), ShipmentCardTotalStyle)}
        >
          <ShipmentHeader
            label={`SHIPMENT ${data.id}`}
            isChecked
            ordersNo={data.numberOfOrder}
            batchesNo={data.numberOfBatch}
            onToggle={() => {}}
          />
          <WrapperCard onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave} onClick={onClick}>
            <TotalCard name="Shipment" quantity={data.quantity} />
            <TagValue>
              {({ value: isToggle }) => (isToggle ? <Tags dataSource={data.tags} /> : null)}
            </TagValue>
          </WrapperCard>
        </BaseCard>
      );
      break;
    }
    default:
      if (typeof type === 'string' && /LINK-[0-4]/.test(type)) {
        const [, linkType] = type.split('-') || [];
        render = <RelationLine type={Number(linkType)} isFocus={isFocused} />;
      }
      break;
  }
  return render;
};

Item.defaultProps = defaultProps;

export default Item;
