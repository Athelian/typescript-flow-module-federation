// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import Icon from 'components/Icon';
import Tag from 'components/Tag';
import FormattedDate from 'components/FormattedDate';
import FALLBACK_IMAGE from 'media/logo_fallback.jpg';
import RelateEntity from 'components/RelateEntity';
import TaskRing from 'components/TaskRing';
import { Display, Blackout, Label } from 'components/Form';
import { encodeId } from 'utils/id';
import { useHasPermissions } from 'components/Context/Permissions';
import { BATCH_CREATE } from 'modules/permission/constants/batch';
import { ORDER_ITEMS_DELETE } from 'modules/permission/constants/orderItem';
import QuantityGraph from 'modules/relationMapV2/components/QuantityGraph';
import {
  ItemCardWrapperStyle,
  TopRowWrapperStyle,
  TagsAndDeliveryWrapperStyle,
  TagsWrapperStyle,
  BottomRowWrapperStyle,
  ProductImageStyle,
  ProductSerialStyle,
  DeleteItemButtonStyle,
  CreateBatchButtonStyle,
} from './style';

type Props = {|
  orderItem: Object,
  onCreateBatch: Event => void,
  onDeleteItem: Event => void,
  organizationId: string,
|};

export default function OrderItemCard({
  orderItem,
  onCreateBatch,
  onDeleteItem,
  organizationId,
}: Props) {
  const hasPermissions = useHasPermissions(organizationId);
  const allowToCreateBatch = hasPermissions(BATCH_CREATE);
  const allowToDeleteItem = hasPermissions(ORDER_ITEMS_DELETE);
  // TODO: Replace with real permissions
  const allowToNavigateToProductForm = true;

  const { no, tags = [], deliveredAt, productProvider = {}, todo = {} } = orderItem;
  const productImageUrl = productProvider?.product?.files?.[0]?.pathSmall ?? FALLBACK_IMAGE;
  const productId = productProvider?.product?.id;
  const productLink =
    productId && allowToNavigateToProductForm ? `/product/${encodeId(productId)}` : null;
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
            <FormattedDate value={deliveredAt} />
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

      {allowToDeleteItem && (
        <button onClick={onDeleteItem} className={DeleteItemButtonStyle} type="button">
          <Icon icon="REMOVE" />
        </button>
      )}

      {allowToCreateBatch && (
        <button onClick={onCreateBatch} className={CreateBatchButtonStyle} type="button">
          <Icon icon="ADD" />
        </button>
      )}
    </div>
  );
}
