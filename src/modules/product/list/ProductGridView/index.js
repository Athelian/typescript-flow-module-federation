// @flow
import * as React from 'react';
import { BooleanValue } from 'react-values';
import { navigate } from '@reach/router';
import { FormattedMessage } from 'react-intl';
import GridView from 'components/GridView';
import { ProductCard, CardAction } from 'components/Cards';
import { ProductActivateDialog, ProductArchiveDialog } from 'modules/product/common/Dialog';
import { PermissionConsumer } from 'modules/permission';
import { encodeId } from 'utils/id';

type Props = {
  items: Array<Object>,
  onLoadMore: Function,
  hasMore: boolean,
  isLoading: boolean,
  renderItem?: Function,
};

function onClone(productId: string) {
  navigate(`/product/clone/${encodeId(productId)}`);
}

const defaultRenderItem = (item: Object, canCreate: boolean, canUpdate: boolean) => (
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
            ...(canCreate ? [<CardAction icon="CLONE" onClick={() => onClone(item.id)} />] : []),
            ...(canUpdate
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
);

const defaultProps = {
  renderItem: defaultRenderItem,
};

const ProductGridView = (props: Props) => {
  const { items, onLoadMore, hasMore, isLoading, renderItem = defaultRenderItem } = props;

  return (
    <PermissionConsumer>
      {hasPermission => (
        <GridView
          onLoadMore={onLoadMore}
          hasMore={hasMore}
          isLoading={isLoading}
          itemWidth="195px"
          isEmpty={items.length === 0}
          emptyMessage={
            <FormattedMessage
              id="modules.Products.noProductFound"
              defaultMessage="No products found"
            />
          }
        >
          {items.map(item =>
            renderItem(
              item,
              hasPermission('product.products.create'),
              hasPermission('product.products.update')
            )
          )}
        </GridView>
      )}
    </PermissionConsumer>
  );
};

ProductGridView.defaultProps = defaultProps;

export default ProductGridView;
