// @flow
import * as React from 'react';
import { BooleanValue } from 'react-values';
import { navigate } from '@reach/router';
import { FormattedMessage } from 'react-intl';
import GridView from 'components/GridView';
import { ProductCard, CardAction } from 'components/Cards';
import { ProductActivateDialog, ProductArchiveDialog } from 'modules/product/common/Dialog';
import { encodeId } from 'utils/id';

type Props = {
  items: Array<Object>,
  onLoadMore: Function,
  hasMore: boolean,
  isLoading: boolean,
  renderItem?: (item: Object) => React.Node,
};

function onClone(productId: string) {
  navigate(`/product/clone/${encodeId(productId)}`);
}

const defaultRenderItem = (item: Object) => (
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
            <CardAction icon="CLONE" onClick={() => onClone(item.id)} />,
            <CardAction
              icon={item.archived ? 'ACTIVE' : 'ARCHIVE'}
              onClick={() => dialogToggle(true)}
            />,
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
      {items.map(item => renderItem(item))}
    </GridView>
  );
};

ProductGridView.defaultProps = defaultProps;

export default ProductGridView;
