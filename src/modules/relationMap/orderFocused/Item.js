// @flow
import React from 'react';
import { Subscribe } from 'unstated';
import { getByPathWithDefault } from 'utils/fp';
import { cx } from 'react-emotion';
import { TagValue } from 'modules/relationMap/common/ToggleTag';
import { ToggleSlide } from 'modules/relationMap/common/SlideForm';
import { ToggleDeleteDialog } from 'modules/relationMap/common/Dialog/DeleteDialog';
import {
  ItemWrapperStyle,
  ShipmentCardStyle,
  ShipmentCardTotalStyle,
} from 'modules/relationMap/common/RelationItem/style';
import RelationMapContainer from 'modules/relationMap/container';
import BaseCard from 'components/Cards';
import { CardAction } from 'components/Cards/BaseCard';

import {
  RelationLine,
  OrderCard,
  OrderItemCard,
  BatchCard,
  TotalCard,
  WrapperCard,
  OrderHeader,
  Tags,
  ShipmentCard,
  ShipmentHeader,
  ShipmentCollapsed,
} from 'components/RelationMap';
import {
  ORDER_ITEM_ALL,
  BATCH_ALL,
  ORDER_HEADER,
  ORDER,
  ORDER_ITEM,
  BATCH,
  SHIPMENT,
  SHIPMENT_ALL,
} from './relation';

type Props = {
  relation: Object,
  itemData: Object,
  itemType: string,
  onToggle: Function,
  isCollapsed: boolean,
};

const initFocusObj = () => ({
  order: {},
  orderItem: {},
  batch: {},
  shipment: {},
});

const isRelationLine = type => /LINK-[0-4]-(\w+)/.test(type);

const getItemType = type => {
  switch (type) {
    case ORDER_ITEM_ALL:
    case BATCH_ALL:
    case ORDER:
      return 'order';
    case ORDER_HEADER:
    case ORDER_ITEM:
      return 'orderItem';
    case BATCH:
      return 'batch';
    default:
      return '';
  }
};

const isFocusedLink = (focusedItem, relatedIds) =>
  Object.keys(focusedItem || {}).some(focusId =>
    relatedIds.some(relatedId => relatedId === focusId)
  );

const Item = ({ relation, itemData, itemType, onToggle, isCollapsed }: Props) => {
  const { relatedIds, type, id } = relation;
  const { data = {}, relation: itemRelation } = itemData;
  return (
    <Subscribe to={[RelationMapContainer]}>
      {({ state: { focusedItem, focusMode }, changeFocusItem, reset }) => {
        if (isRelationLine(type)) {
          const [, linkType, relationType] = relation.type.split('-') || [];
          const lineItemType = getItemType(relationType);
          const isFocused = isFocusedLink(focusedItem[lineItemType], relatedIds);
          const hasRelation = getByPathWithDefault(false, `${lineItemType}.${id}`, focusedItem);
          return (
            <RelationLine
              type={linkType}
              focusMode={focusMode}
              isFocused={isFocused}
              hasRelation={hasRelation}
            />
          );
        }
        const onClickHighlight = mode => () =>
          changeFocusItem({ focusedItem: itemRelation || {}, focusMode: mode });
        const onClickTarget = () => {
          const item = focusMode === 'TARGET' ? focusedItem : initFocusObj();
          const targetItem = Object.assign(item, {
            [itemType]: {
              ...item[itemType],
              [data.id]: data,
            },
          });
          changeFocusItem({ focusedItem: targetItem, focusMode: 'TARGET' });
        };
        const isFocused = getByPathWithDefault(false, `${itemType}.${id}` || '', focusedItem);
        const cardWrapperClass = ItemWrapperStyle(isFocused, focusMode);
        const actions = [
          <CardAction icon="SQUARE" onClick={onClickHighlight('HIGHLIGHT')} />,
          <CardAction icon="BRANCH" onClick={onClickHighlight('TARGET_TREE')} />,
          <CardAction icon="CLEAR" onClick={reset} />,
        ];
        switch (type) {
          default: {
            return <div />;
          }
          case ORDER_HEADER: {
            return <OrderHeader label={`ORDER ${data.id || ''}`} isChecked />;
          }
          case ORDER: {
            return (
              <ToggleDeleteDialog>
                {({ assign: toggleDeleteDialog }) => (
                  <BaseCard
                    showActionsOnHover
                    icon={type}
                    color={type}
                    wrapperClassName={cardWrapperClass}
                    actions={[
                      ...actions,
                      <CardAction
                        icon="REMOVE"
                        onClick={() =>
                          toggleDeleteDialog({
                            isOpen: true,
                            data,
                            type,
                          })
                        }
                      />,
                    ]}
                  >
                    <ToggleSlide>
                      {({ assign: setSlide }) => {
                        const onDoubleClick = () => setSlide({ show: true, type, id });
                        return (
                          <WrapperCard onClick={onClickTarget} onDoubleClick={onDoubleClick}>
                            <OrderCard order={data} />
                            <TagValue>
                              {({ value: isToggle }) => isToggle && <Tags dataSource={data.tags} />}
                            </TagValue>
                          </WrapperCard>
                        );
                      }}
                    </ToggleSlide>
                  </BaseCard>
                )}
              </ToggleDeleteDialog>
            );
          }
          case ORDER_ITEM: {
            return (
              <ToggleDeleteDialog>
                {({ assign: toggleDeleteDialog }) => (
                  <BaseCard
                    showActionsOnHover
                    icon={type}
                    color={type}
                    actions={[
                      ...actions,
                      <CardAction
                        icon="REMOVE"
                        onClick={() =>
                          toggleDeleteDialog({
                            isOpen: true,
                            data,
                            type,
                          })
                        }
                      />,
                    ]}
                    wrapperClassName={cardWrapperClass}
                  >
                    <WrapperCard onClick={onClickTarget}>
                      <OrderItemCard orderItem={data} />
                    </WrapperCard>
                  </BaseCard>
                )}
              </ToggleDeleteDialog>
            );
          }
          case BATCH: {
            return (
              <ToggleDeleteDialog>
                {({ assign: toggleDeleteDialog }) => (
                  <BaseCard
                    showActionsOnHover
                    icon={type}
                    color={type}
                    actions={[
                      ...actions,
                      <CardAction
                        icon="REMOVE"
                        onClick={() =>
                          toggleDeleteDialog({
                            isOpen: true,
                            data,
                            type,
                          })
                        }
                      />,
                    ]}
                    wrapperClassName={cardWrapperClass}
                  >
                    <ToggleSlide>
                      {({ assign: setSlide }) => {
                        const onDoubleClick = () => setSlide({ show: true, type, id });
                        return (
                          <WrapperCard onClick={onClickTarget} onDoubleClick={onDoubleClick}>
                            <BatchCard batch={data} />
                            <TagValue>
                              {({ value: isToggle }) => isToggle && <Tags dataSource={data.tags} />}
                            </TagValue>
                          </WrapperCard>
                        );
                      }}
                    </ToggleSlide>
                  </BaseCard>
                )}
              </ToggleDeleteDialog>
            );
          }
          case ORDER_ITEM_ALL: {
            return (
              <BaseCard wrapperClassName={cardWrapperClass}>
                <WrapperCard onClick={onToggle}>
                  <TotalCard name="Items" quantity={data.totalItem} />
                </WrapperCard>
              </BaseCard>
            );
          }
          case BATCH_ALL: {
            return (
              <BaseCard wrapperClassName={cardWrapperClass}>
                <WrapperCard onClick={onToggle}>
                  <TotalCard name="Batches" quantity={data.totalBatch} />
                </WrapperCard>
              </BaseCard>
            );
          }
          case SHIPMENT: {
            return (
              <>
                <ShipmentHeader
                  label={`SHIPMENT ${data.id}`}
                  isChecked
                  ordersNo={data.totalOrder}
                  batchesNo={data.totalBatch}
                  onToggle={onToggle}
                  isCollapsed={isCollapsed}
                />
                <ToggleDeleteDialog>
                  {({ assign: toggleDeleteDialog }) => (
                    <BaseCard
                      showActionsOnHover
                      icon={type}
                      color={type}
                      actions={[
                        ...actions,
                        <CardAction
                          icon="REMOVE"
                          onClick={() =>
                            toggleDeleteDialog({
                              isOpen: true,
                              data,
                              type,
                            })
                          }
                        />,
                      ]}
                      wrapperClassName={cx(cardWrapperClass, ShipmentCardStyle)}
                    >
                      <ToggleSlide>
                        {({ assign: setSlide }) => {
                          const onDoubleClick = () => setSlide({ show: true, type, id });
                          return (
                            <WrapperCard onClick={onClickTarget} onDoubleClick={onDoubleClick}>
                              <ShipmentCard shipment={data} />
                              <TagValue>
                                {({ value: isToggle }) =>
                                  isToggle ? <Tags dataSource={data.tags} /> : null
                                }
                              </TagValue>
                            </WrapperCard>
                          );
                        }}
                      </ToggleSlide>
                    </BaseCard>
                  )}
                </ToggleDeleteDialog>
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
                  onToggle={onToggle}
                  isCollapsed={isCollapsed}
                />
                <ToggleDeleteDialog>
                  {({ assign: toggleDeleteDialog }) => (
                    <BaseCard
                      showActionsOnHover
                      icon="SHIPMENT"
                      color="SHIPMENT"
                      actions={[
                        ...actions,
                        <CardAction
                          icon="REMOVE"
                          onClick={() =>
                            toggleDeleteDialog({
                              isOpen: true,
                              data,
                              type,
                            })
                          }
                        />,
                      ]}
                      wrapperClassName={cx(cardWrapperClass, ShipmentCardTotalStyle)}
                    >
                      <WrapperCard onClick={onToggle}>
                        <ShipmentCollapsed shipment={data} />
                        <TagValue>
                          {({ value: isToggle }) =>
                            isToggle ? <Tags dataSource={data.tags} /> : null
                          }
                        </TagValue>
                      </WrapperCard>
                    </BaseCard>
                  )}
                </ToggleDeleteDialog>
              </>
            );
          }
        }
      }}
    </Subscribe>
  );
};

export default Item;
