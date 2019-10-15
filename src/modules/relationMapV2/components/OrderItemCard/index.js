// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import Tag from 'components/Tag';
import FormattedDate from 'components/FormattedDate';
import FALLBACK_IMAGE from 'media/logo_fallback.jpg';
import RelateEntity from 'components/RelateEntity';
import TaskRing from 'components/TaskRing';
import { Display, Blackout, Label } from 'components/Form';
import { encodeId } from 'utils/id';
import { useHasPermissions } from 'contexts/Permissions';
import { BATCH_CREATE } from 'modules/permission/constants/batch';
import { ORDER_ITEMS_DELETE, ORDER_ITEMS_FORM } from 'modules/permission/constants/orderItem';
import QuantityGraph from 'modules/relationMapV2/components/QuantityGraph';
import CardActions from 'modules/relationMapV2/components/CardActions';
import { FocusedView } from 'modules/relationMapV2/store';
import {
  ItemCardWrapperStyle,
  TopRowWrapperStyle,
  TagsAndDeliveryWrapperStyle,
  TagsWrapperStyle,
  BottomRowWrapperStyle,
  ProductImageStyle,
  ProductSerialStyle,
} from './style';

type Props = {|
  orderItem: Object,
  onViewForm: Event => void,
  onCreateBatch: Event => void,
  onDeleteItem: Event => void,
  organizationId: string,
|};

export default function OrderItemCard({
  orderItem,
  onViewForm,
  onCreateBatch,
  onDeleteItem,
  organizationId,
}: Props) {
  const { selectors } = FocusedView.useContainer();
  const hasPermissions = useHasPermissions(organizationId);
  const allowToViewForm = hasPermissions(ORDER_ITEMS_FORM);
  const allowToCreateBatch = hasPermissions(BATCH_CREATE);
  const allowToDeleteItem = hasPermissions(ORDER_ITEMS_DELETE);
  // TODO: Replace with real permissions
  const allowToNavigateToProductForm = true;

  const { no, tags = [], deliveryDate, productProvider = {}, todo = {} } = orderItem;
  const productImageUrl = productProvider?.product?.files?.[0]?.pathSmall ?? FALLBACK_IMAGE;
  const productId = productProvider?.product?.id;
  const productLink =
    productId && allowToNavigateToProductForm ? `/product/${encodeId(productId)}` : '';
  const productName = productProvider?.product?.name;
  const productSerial = productProvider?.product?.serial;

  // TODO: Replace with real permissions
  const canViewNo = true;
  const canViewTags = true;
  const canViewDelivery = true;
  const canViewProductImage = true;
  const canViewProductName = true;
  const canViewProductSerial = true;
  const canViewQuantityGraph = true;
  const canViewTasks = true;

  return (
    <div className={ItemCardWrapperStyle}>
      <div className={TopRowWrapperStyle}>
        <Display blackout={!canViewNo}>{no}</Display>

        <div className={TagsAndDeliveryWrapperStyle}>
          {canViewTags ? (
            <div className={TagsWrapperStyle}>
              {tags.map(tag => (
                <Tag key={tag.id} tag={tag} />
              ))}
            </div>
          ) : (
            <Blackout />
          )}

          <Label width="75px">
            <FormattedMessage id="components.cards.delivery" />
          </Label>
          <Display blackout={!canViewDelivery} width="80px">
            <FormattedDate value={deliveryDate} />
          </Display>
        </div>
      </div>

      <div className={BottomRowWrapperStyle}>
        {canViewProductImage ? (
          <img src={productImageUrl} className={ProductImageStyle} alt="Product" />
        ) : (
          <Blackout />
        )}

        <RelateEntity
          blackout={!canViewProductName}
          link={productLink}
          entity="PRODUCT"
          value={productName}
          width="125px"
        />

        {canViewProductSerial ? (
          <div className={ProductSerialStyle}>{productSerial}</div>
        ) : (
          <Blackout />
        )}

        {canViewQuantityGraph ? <QuantityGraph orderItems={[orderItem]} /> : <Blackout />}

        <TaskRing blackout={!canViewTasks} {...todo} />
      </div>

      <CardActions
        actions={[
          allowToViewForm && {
            label: (
              <FormattedMessage
                id="modules.RelationMap.cards.viewForm"
                defaultMessage="View Form"
              />
            ),
            onClick: onViewForm,
          },
          allowToCreateBatch &&
            selectors.isOrderFocus && {
              label: (
                <FormattedMessage
                  id="modules.RelationMap.item.createBatch"
                  defaultMessage="Create Batch"
                />
              ),
              onClick: onCreateBatch,
            },
          allowToDeleteItem &&
            selectors.isOrderFocus && {
              label: (
                <FormattedMessage id="modules.RelationMap.cards.delete" defaultMessage="Delete" />
              ),
              onClick: onDeleteItem,
            },
        ].filter(Boolean)}
      />
    </div>
  );
}
