// @flow
import * as React from 'react';
import { BooleanValue } from 'react-values';
import { navigate } from '@reach/router';
import { FormattedMessage } from 'react-intl';
import usePermission from 'hooks/usePermission';
import GridView from 'components/GridView';
import { ProductCard, CardAction } from 'components/Cards';
import { ProductActivateDialog, ProductArchiveDialog } from 'modules/product/common/Dialog';
import {
  PRODUCT_CREATE,
  PRODUCT_UPDATE,
  PRODUCT_SET_ARCHIVED,
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
  const { items, onLoadMore, hasMore, isLoading } = props;
  const { hasPermission } = usePermission();
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
                  ...(hasPermission(PRODUCT_CREATE)
                    ? [<CardAction icon="CLONE" onClick={() => onClone(item.id)} />]
                    : []),
                  ...(hasPermission([PRODUCT_UPDATE, PRODUCT_SET_ARCHIVED])
                    ? [
                        <CardAction
                          icon={item.archived ? 'ACTIVE' : 'ARCHIVE'}
                          onClick={() => dialogToggle(true)}
                        />,
                      ]
                    : []),
                ]}
                showActionsOnHover
              />
            </>
          )}
        </BooleanValue>
      ))}
    </GridView>
  );
};

export default ProductGridView;
