// @flow
import * as React from 'react';
import { BooleanValue } from 'react-values';
import { navigate } from '@reach/router';
import { FormattedMessage } from 'react-intl';
import usePartnerPermission from 'hooks/usePartnerPermission';
import usePermission from 'hooks/usePermission';
import GridView from 'components/GridView';
import { ProductCard, CardAction } from 'components/Cards';
import { ProductActivateDialog, ProductArchiveDialog } from 'modules/product/common/Dialog';
import {
  PRODUCT_CREATE,
  PRODUCT_UPDATE,
  PRODUCT_SET_ARCHIVED,
  PRODUCT_FORM,
} from 'modules/permission/constants/product';
import { encodeId } from 'utils/id';

type Props = {
  items: Array<Object>,
  onLoadMore: Function,
  hasMore: boolean,
  isLoading: boolean,
};

function onClone(productId: string) {
  navigate(`/product/clone/${encodeId(productId)}`);
}

const ProductGridView = (props: Props) => {
  const { isOwner } = usePartnerPermission();
  const { hasPermission } = usePermission(isOwner);
  const { items, onLoadMore, hasMore, isLoading } = props;

  const canViewForm = hasPermission(PRODUCT_FORM);
  const canCreate = hasPermission(PRODUCT_CREATE);
  const canUpdateStatus = hasPermission([PRODUCT_UPDATE, PRODUCT_SET_ARCHIVED]);

  return (
    <GridView
      onLoadMore={onLoadMore}
      hasMore={hasMore}
      isLoading={isLoading}
      itemWidth="195px"
      isEmpty={items.length === 0}
      emptyMessage={
        <FormattedMessage id="modules.Products.noProductFound" defaultMessage="No products found" />
      }
    >
      {items.map(item => (
        <BooleanValue key={item.id}>
          {({ value: statusDialogIsOpen, set: dialogToggle }) => (
            <>
              {item.archived ? (
                <ProductActivateDialog
                  onRequestClose={() => dialogToggle(false)}
                  isOpen={statusDialogIsOpen}
                  product={item}
                />
              ) : (
                <ProductArchiveDialog
                  onRequestClose={() => dialogToggle(false)}
                  isOpen={statusDialogIsOpen}
                  product={item}
                />
              )}
              <ProductCard
                product={item}
                actions={[
                  ...(canCreate
                    ? [<CardAction icon="CLONE" onClick={() => onClone(item.id)} />]
                    : []),
                  ...(canUpdateStatus
                    ? [
                        <CardAction
                          icon={item.archived ? 'ACTIVE' : 'ARCHIVE'}
                          onClick={() => dialogToggle(true)}
                        />,
                      ]
                    : []),
                ]}
                showActionsOnHover
                onClick={() => (canViewForm ? navigate(`/product/${encodeId(item.id)}`) : {})}
              />
            </>
          )}
        </BooleanValue>
      ))}
    </GridView>
  );
};

export default ProductGridView;
