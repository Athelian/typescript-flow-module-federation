// @flow
import React from 'react';
import { Subscribe } from 'unstated';
import { getByPathWithDefault, omit } from 'utils/fp';
import { cx } from 'react-emotion';
import { BooleanValue } from 'react-values';
import { TagValue } from 'modules/relationMap/common/ToggleTag';
import { ToggleSlide } from 'modules/relationMap/common/SlideForm';
// import { ToggleDeleteDialog } from 'modules/relationMap/common/Dialog/DeleteDialog';
import {
  ItemWrapperStyle,
  ShipmentCardStyle,
  ShipmentCardTotalStyle,
} from 'modules/relationMap/common/RelationItem/style';
import RelationMapContainer from 'modules/relationMap/container';
import ActionCard, { Action } from 'modules/relationMap/common/ActionCard';
import BaseCard from 'components/Cards';
// import { CardAction } from 'components/Cards/BaseCard';

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
        const onClickHighlight = mode => () => {
          if (getByPathWithDefault(false, `${itemType}.${id}`, focusedItem)) {
            return reset();
          }
          return changeFocusItem({
            focusedItem: itemRelation || {},
            focusMode: mode,
          });
        };
        const onClickTarget = () => {
          const item = focusMode === 'TARGET' ? focusedItem : initFocusObj();
          const targetItem = Object.assign(item, {
            [itemType]: getByPathWithDefault(false, `${itemType}.${id}`, item)
              ? omit([id], item[itemType])
              : {
                  ...item[itemType],
                  [data.id]: data,
                },
          });
          changeFocusItem({
            focusedItem: targetItem,
            focusMode: 'TARGET',
          });
        };
        const isFocused = getByPathWithDefault(false, `${itemType}.${id}` || '', focusedItem);
        const cardWrapperClass = ItemWrapperStyle(isFocused, focusMode);
        // const actions = [
        //   <CardAction icon="SQUARE" onClick={onClickHighlight('HIGHLIGHT')} />,
        //   <CardAction icon="BRANCH" onClick={onClickHighlight('TARGET_TREE')} />,
        //   <CardAction icon="CLEAR" onClick={reset} />,
        // ];
        switch (type) {
          default: {
            return <div />;
          }
          case ORDER_HEADER: {
            return <OrderHeader label={`ORDER ${data.id || ''}`} isChecked />;
          }
          case ORDER: {
            return (
              <BaseCard icon={type} color={type} wrapperClassName={cardWrapperClass}>
                <ToggleSlide>
                  {({ assign: setSlide }) => (
                    <BooleanValue>
                      {({ value: hovered, set: setToggle }) => (
                        <WrapperCard
                          onMouseEnter={() => setToggle(true)}
                          onMouseLeave={() => setToggle(false)}
                        >
                          <OrderCard order={data} />
                          <ActionCard show={hovered}>
                            {({ targetted, toggle }) => (
                              <>
                                <Action
                                  icon="MAGIC"
                                  targetted={targetted}
                                  toggle={toggle}
                                  onClick={onClickHighlight('HIGHLIGHT')}
                                />
                                <Action
                                  icon="DOCUMENT"
                                  targetted={targetted}
                                  toggle={toggle}
                                  onClick={() => setSlide({ show: true, type, id })}
                                />
                                <Action
                                  icon="BRANCH"
                                  targetted={targetted}
                                  toggle={toggle}
                                  onClick={onClickHighlight('TARGET_TREE')}
                                />
                                <Action
                                  icon="CHECKED"
                                  targetted={targetted}
                                  toggle={toggle}
                                  onClick={onClickTarget}
                                />
                              </>
                            )}
                          </ActionCard>
                          <TagValue>
                            {({ value: isToggle }) => isToggle && <Tags dataSource={data.tags} />}
                          </TagValue>
                        </WrapperCard>
                      )}
                    </BooleanValue>
                  )}
                </ToggleSlide>
              </BaseCard>
            );
          }
          case ORDER_ITEM: {
            return (
              <BaseCard icon={type} color={type} wrapperClassName={cardWrapperClass}>
                <BooleanValue>
                  {({ value: hovered, set: setToggle }) => (
                    <WrapperCard
                      onMouseEnter={() => setToggle(true)}
                      onMouseLeave={() => setToggle(false)}
                    >
                      <OrderItemCard orderItem={data} />
                      <ActionCard show={hovered}>
                        {({ targetted, toggle }) => (
                          <>
                            <Action
                              icon="MAGIC"
                              targetted={targetted}
                              toggle={toggle}
                              onClick={onClickHighlight('HIGHLIGHT')}
                            />
                            <Action
                              icon="BRANCH"
                              targetted={targetted}
                              toggle={toggle}
                              onClick={onClickHighlight('TARGET_TREE')}
                            />
                            <Action
                              icon="CHECKED"
                              targetted={targetted}
                              toggle={toggle}
                              onClick={onClickTarget}
                            />
                          </>
                        )}
                      </ActionCard>
                    </WrapperCard>
                  )}
                </BooleanValue>
              </BaseCard>
            );
          }
          case BATCH: {
            return (
              <BaseCard
                showActionsOnHover
                icon={type}
                color={type}
                wrapperClassName={cardWrapperClass}
              >
                <ToggleSlide>
                  {({ assign: setSlide }) => (
                    <BooleanValue>
                      {({ value: hovered, set: setToggle }) => (
                        <WrapperCard
                          onMouseEnter={() => setToggle(true)}
                          onMouseLeave={() => setToggle(false)}
                        >
                          <BatchCard batch={data} />
                          <ActionCard show={hovered}>
                            {({ targetted, toggle }) => (
                              <>
                                <Action
                                  icon="MAGIC"
                                  targetted={targetted}
                                  toggle={toggle}
                                  onClick={onClickHighlight('HIGHLIGHT')}
                                />
                                <Action
                                  icon="DOCUMENT"
                                  targetted={targetted}
                                  toggle={toggle}
                                  onClick={() => setSlide({ show: true, type, id })}
                                />
                                <Action
                                  icon="BRANCH"
                                  targetted={targetted}
                                  toggle={toggle}
                                  onClick={onClickHighlight('TARGET_TREE')}
                                />
                                <Action
                                  icon="CHECKED"
                                  targetted={targetted}
                                  toggle={toggle}
                                  onClick={onClickTarget}
                                />
                              </>
                            )}
                          </ActionCard>
                          <TagValue>
                            {({ value: isToggle }) => isToggle && <Tags dataSource={data.tags} />}
                          </TagValue>
                        </WrapperCard>
                      )}
                    </BooleanValue>
                  )}
                </ToggleSlide>
              </BaseCard>
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

                <BaseCard
                  showActionsOnHover
                  icon={type}
                  color={type}
                  wrapperClassName={cx(cardWrapperClass, ShipmentCardStyle)}
                >
                  <ToggleSlide>
                    {({ assign: setSlide }) => (
                      <BooleanValue>
                        {({ value: hovered, set: setToggle }) => (
                          <WrapperCard
                            onMouseEnter={() => setToggle(true)}
                            onMouseLeave={() => setToggle(false)}
                          >
                            <ShipmentCard shipment={data} />
                            <ActionCard show={hovered}>
                              {({ targetted, toggle }) => (
                                <>
                                  <Action
                                    icon="MAGIC"
                                    targetted={targetted}
                                    toggle={toggle}
                                    onClick={onClickHighlight('HIGHLIGHT')}
                                  />
                                  <Action
                                    icon="DOCUMENT"
                                    targetted={targetted}
                                    toggle={toggle}
                                    onClick={() => setSlide({ show: true, type, id })}
                                  />
                                  <Action
                                    icon="BRANCH"
                                    targetted={targetted}
                                    toggle={toggle}
                                    onClick={onClickHighlight('TARGET_TREE')}
                                  />
                                  <Action
                                    icon="CHECKED"
                                    targetted={targetted}
                                    toggle={toggle}
                                    onClick={onClickTarget}
                                  />
                                </>
                              )}
                            </ActionCard>
                            <TagValue>
                              {({ value: isToggle }) =>
                                isToggle ? <Tags dataSource={data.tags} /> : null
                              }
                            </TagValue>
                          </WrapperCard>
                        )}
                      </BooleanValue>
                    )}
                  </ToggleSlide>
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
                  onToggle={onToggle}
                  isCollapsed={isCollapsed}
                />
                <BaseCard
                  showActionsOnHover
                  icon="SHIPMENT"
                  color="SHIPMENT"
                  wrapperClassName={cx(cardWrapperClass, ShipmentCardTotalStyle)}
                >
                  <WrapperCard onClick={onToggle}>
                    <ShipmentCollapsed shipment={data} />
                    <TagValue>
                      {({ value: isToggle }) => (isToggle ? <Tags dataSource={data.tags} /> : null)}
                    </TagValue>
                  </WrapperCard>
                </BaseCard>
              </>
            );
          }
        }
      }}
    </Subscribe>
  );
};

export default Item;
