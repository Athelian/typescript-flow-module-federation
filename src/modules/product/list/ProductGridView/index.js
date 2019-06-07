// @flow
import * as React from 'react';
import { BooleanValue } from 'react-values';
import { navigate } from '@reach/router';
import { FormattedMessage } from 'react-intl';
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
import PartnerPermissionsWrapper from 'components/PartnerPermissionsWrapper';

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
  const { items, onLoadMore, hasMore, isLoading } = props;

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
              <PartnerPermissionsWrapper data={item}>
                {permissions => (
                  <ProductCard
                    product={item}
                    actions={[
                      ...(permissions.includes(PRODUCT_CREATE)
                        ? [<CardAction icon="CLONE" onClick={() => onClone(item.id)} />]
                        : []),
                      ...(permissions.includes(PRODUCT_UPDATE) ||
                      permissions.includes(PRODUCT_SET_ARCHIVED)
                        ? [
                            <CardAction
                              icon={item.archived ? 'ACTIVE' : 'ARCHIVE'}
                              onClick={() => dialogToggle(true)}
                            />,
                          ]
                        : []),
                    ]}
                    showActionsOnHover
                    onClick={() => {
                      if (permissions.includes(PRODUCT_FORM)) {
                        navigate(`/product/${encodeId(item.id)}`);
                      }
                    }}
                  />
                )}
              </PartnerPermissionsWrapper>
            </>
          )}
        </BooleanValue>
      ))}
    </GridView>
  );
};

export default ProductGridView;
