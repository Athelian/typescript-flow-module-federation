// @flow
import React from 'react';
import { Subscribe } from 'unstated';
import { getByPathWithDefault as get } from 'utils/fp';
import { cx } from 'react-emotion';
import { BooleanValue } from 'react-values';
import { TagValue } from 'modules/relationMap/common/ToggleTag';
import { ToggleSlide } from 'modules/relationMap/common/SlideForm';
import { SelectedShipment, SelectedOrder } from 'modules/relationMap/common/SelectedConnect';
import NewItemBadge from 'modules/relationMap/common/NewItemBadge';
import {
  ItemWrapperStyle,
  ShipmentCardStyle,
  ShipmentCardTotalStyle,
} from 'modules/relationMap/common/RelationItem/style';
import { RotateIcon } from 'modules/relationMap/common/ActionCard/style';
import RelationMapContainer from 'modules/relationMap/container';
import { ActionContainer, ConnectContainer } from 'modules/relationMap/containers';
import ActionCard, { Action, DisabledAction } from 'modules/relationMap/common/ActionCard';
import { isDisabledChooseOrder } from 'modules/relationMap/common/ActionPanel/util';
import BaseCard from 'components/Cards';
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
  ORDER_ALL,
  ORDER_ITEM,
  BATCH,
  SHIPMENT,
  SHIPMENT_ALL,
} from 'modules/relationMap/constants';

type Props = {
  relation: Object,
  itemData: Object,
  itemType: string,
  onToggle: Function,
  isCollapsed: boolean,
};

const isRelationLine = type => /LINK-[0-4]-(\w+)/.test(type);

export const getItemType = (type: string) => {
  switch (type) {
    case ORDER_ITEM_ALL:
    case BATCH_ALL:
    case ORDER_ALL:
    case ORDER:
      return 'order';
    case ORDER_HEADER:
    case ORDER_ITEM:
      return 'orderItem';
    case BATCH:
      return 'batch';
    case SHIPMENT:
      return 'shipment';
    default:
      return '';
  }
};

const isFocusedLink = (focusedItem, relatedIds) =>
  Object.keys(focusedItem || {}).some(focusId =>
    relatedIds.some(relatedId => relatedId === focusId)
  );

const Item = ({ relation, itemData, itemType, onToggle, isCollapsed }: Props) => {
  const { relatedIds, type, id, isNew } = relation;
  const { data = {}, relation: itemRelation } = itemData;
  return (
    <Subscribe to={[RelationMapContainer]}>
      {({
        state: { focusedItem, focusMode, focusedId, targetedItem },
        toggleHighlight,
        toggleTargetTree,
        toggleTarget,
        // overrideTarget,
        isTargetedLine,
        isParentTargeted,
        isTargeted: isTargetedItem,
        isCurrentTree,
        isFocused: isFocusedItem,
      }) => {
        if (isRelationLine(type)) {
          const [, linkType, relationType] = relation.type.split('-') || [];
          const lineItemType = getItemType(relationType);
          // @TODO need refactor for more clear logic
          const isAllOrderItemLine = relationType === ORDER_ITEM_ALL && !isCollapsed;
          const isAllBatchLine = relationType === BATCH_ALL && !isCollapsed;
          const isFocused = isAllBatchLine
            ? false
            : isFocusedLink(focusedItem[lineItemType], relatedIds);

          const isTargeted = isAllBatchLine
            ? false
            : isParentTargeted(data, relationType) && isTargetedLine(id);
          const isRelated =
            get(false, `${lineItemType}.${id}`, focusedItem) ||
            get(false, `${lineItemType}.${id}`, targetedItem);
          const hasRelation = isAllOrderItemLine ? false : isRelated;
          return (
            <RelationLine
              type={linkType}
              isTargeted={isTargeted}
              isFocused={isFocused}
              hasRelation={hasRelation}
            />
          );
        }
        const onClickHighlight = toggleHighlight(itemRelation, id);
        const onClickTargetTree = toggleTargetTree(itemData, relation);
        const onClickTarget = toggleTarget(itemData, relation, itemType);
        const isFocused = isFocusedItem(itemType, id);
        const isCurrentFocused = focusedId && focusedId === id;
        const isTargeted = isTargetedItem(itemType, id);
        const isCurrentTarget = isCurrentTree(id);
        const cardWrapperClass = ItemWrapperStyle(isFocused, isTargeted, isCurrentFocused);
        const totalCardWrapperClass =
          !isCollapsed || focusMode === 'TARGET'
            ? ItemWrapperStyle(false)
            : ItemWrapperStyle(isFocused, isTargeted);
        switch (type) {
          default: {
            return <div />;
          }
          case ORDER_HEADER: {
            return <OrderHeader label={`ORDER ${data.id || ''}`} isChecked />;
          }
          case ORDER: {
            return (
              <BaseCard
                id={`item-${id}`}
                icon={type}
                color={type}
                wrapperClassName={cardWrapperClass}
              >
                <>
                  {isNew && <NewItemBadge label={isNew} />}
                  <ToggleSlide>
                    {({ assign: setSlide }) => (
                      <Subscribe to={[ConnectContainer, ActionContainer]}>
                        {({
                          setSelectedItem,
                          resetSelectedItem,
                          isSelectedItem,
                          state: { connectType },
                        }) => (
                          <BooleanValue>
                            {({ value: hovered, set: setToggle }) => (
                              <WrapperCard
                                onMouseEnter={() => setToggle(true)}
                                onMouseLeave={() => setToggle(false)}
                              >
                                <OrderCard order={data} />
                                {(function renderAction() {
                                  if (connectType === 'ORDER') {
                                    if (isDisabledChooseOrder(data, targetedItem)) {
                                      return (
                                        <ActionCard show>{() => <DisabledAction />}</ActionCard>
                                      );
                                    }
                                    if (isSelectedItem(id)) {
                                      return (
                                        <ActionCard show>
                                          {() => <SelectedOrder onClick={resetSelectedItem} />}
                                        </ActionCard>
                                      );
                                    }
                                    return (
                                      <ActionCard show={hovered}>
                                        {() => (
                                          <Action
                                            icon="CHECKED"
                                            onClick={() => setSelectedItem(data)}
                                          />
                                        )}
                                      </ActionCard>
                                    );
                                  }
                                  return (
                                    <ActionCard show={hovered}>
                                      {({ targetted, toggle }) => (
                                        <>
                                          <Action
                                            icon="MAGIC"
                                            targetted={targetted}
                                            toggle={toggle}
                                            onClick={onClickHighlight}
                                          />
                                          <Action
                                            icon="DOCUMENT"
                                            targetted={targetted}
                                            toggle={toggle}
                                            onClick={() => setSlide({ show: true, type, id })}
                                          />
                                          <Action
                                            icon="BRANCH"
                                            targetted={isCurrentTarget ? 'BRANCH' : targetted}
                                            toggle={toggle}
                                            onClick={onClickTargetTree}
                                            className={RotateIcon}
                                          />
                                          <Action
                                            icon="CHECKED"
                                            targetted={isTargeted ? 'CHECKED' : targetted}
                                            toggle={toggle}
                                            onClick={() => {
                                              if (connectType === 'ORDER') {
                                                if (!isDisabledChooseOrder(data, targetedItem)) {
                                                  return setSelectedItem(data);
                                                }
                                                return null;
                                              }
                                              return onClickTarget();
                                            }}
                                          />
                                        </>
                                      )}
                                    </ActionCard>
                                  );
                                })()}
                                <TagValue>
                                  {({ value: isToggle }) =>
                                    isToggle && <Tags dataSource={data.tags} />
                                  }
                                </TagValue>
                              </WrapperCard>
                            )}
                          </BooleanValue>
                        )}
                      </Subscribe>
                    )}
                  </ToggleSlide>
                </>
              </BaseCard>
            );
          }
          case ORDER_ITEM: {
            return (
              <BaseCard
                id={`item-${id}`}
                icon={type}
                color={type}
                wrapperClassName={cardWrapperClass}
              >
                <>
                  {isNew && <NewItemBadge label={isNew} />}
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
                                onClick={onClickHighlight}
                              />
                              <Action
                                icon="BRANCH"
                                targetted={isCurrentTarget ? 'BRANCH' : targetted}
                                toggle={toggle}
                                onClick={onClickTargetTree}
                                className={RotateIcon}
                              />
                              <Action
                                icon="CHECKED"
                                targetted={isTargeted ? 'CHECKED' : targetted}
                                toggle={toggle}
                                onClick={onClickTarget}
                              />
                            </>
                          )}
                        </ActionCard>
                      </WrapperCard>
                    )}
                  </BooleanValue>
                </>
              </BaseCard>
            );
          }
          case BATCH: {
            return (
              <BaseCard
                id={`item-${id}`}
                showActionsOnHover
                icon={type}
                color={type}
                wrapperClassName={cardWrapperClass}
              >
                <>
                  {isNew && <NewItemBadge label={isNew} />}
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
                                    onClick={onClickHighlight}
                                  />
                                  <Action
                                    icon="DOCUMENT"
                                    targetted={targetted}
                                    toggle={toggle}
                                    onClick={() => setSlide({ show: true, type, id })}
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
                </>
              </BaseCard>
            );
          }
          case ORDER_ITEM_ALL: {
            return (
              <BaseCard wrapperClassName={totalCardWrapperClass}>
                <WrapperCard onClick={onToggle}>
                  <TotalCard name="Items" quantity={data.totalItem} />
                </WrapperCard>
              </BaseCard>
            );
          }
          case BATCH_ALL: {
            return (
              <BaseCard wrapperClassName={totalCardWrapperClass}>
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
                  id={id}
                  showActionsOnHover
                  icon={type}
                  color={type}
                  wrapperClassName={cx(cardWrapperClass, ShipmentCardStyle)}
                >
                  <>
                    {isNew && <NewItemBadge label={isNew} />}
                    <ToggleSlide>
                      {({ assign: setSlide }) => (
                        <Subscribe to={[ConnectContainer, ActionContainer]}>
                          {({
                            setSelectedItem,
                            resetSelectedItem,
                            isSelectedItem,
                            state: { connectType },
                          }) => (
                            <BooleanValue>
                              {({ value: hovered, set: setToggle }) => (
                                <WrapperCard
                                  onMouseEnter={() => setToggle(true)}
                                  onMouseLeave={() => setToggle(false)}
                                >
                                  <ShipmentCard shipment={data} />
                                  {(() => {
                                    if (connectType === SHIPMENT) {
                                      if (isSelectedItem(id)) {
                                        return (
                                          <ActionCard show>
                                            {() => <SelectedShipment onClick={resetSelectedItem} />}
                                          </ActionCard>
                                        );
                                      }
                                      return (
                                        <ActionCard show={hovered}>
                                          {() => (
                                            <Action
                                              icon="CHECKED"
                                              onClick={() => setSelectedItem(data)}
                                            />
                                          )}
                                        </ActionCard>
                                      );
                                    }
                                    return (
                                      <ActionCard show={hovered}>
                                        {({ targetted, toggle }) => (
                                          <>
                                            <Action
                                              icon="MAGIC"
                                              targetted={targetted}
                                              toggle={toggle}
                                              onClick={onClickHighlight}
                                            />
                                            <Action
                                              icon="DOCUMENT"
                                              targetted={targetted}
                                              toggle={toggle}
                                              onClick={() => setSlide({ show: true, type, id })}
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
                                    );
                                  })()}
                                  <TagValue>
                                    {({ value: isToggle }) =>
                                      isToggle ? <Tags dataSource={data.tags} /> : null
                                    }
                                  </TagValue>
                                </WrapperCard>
                              )}
                            </BooleanValue>
                          )}
                        </Subscribe>
                      )}
                    </ToggleSlide>
                  </>
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
                    {isNew && <NewItemBadge label={isNew} />}
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
