// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import GridView from 'components/GridView';
import { ProductCard } from 'components/Cards';

type Props = {
  items: Array<Object>,
  onLoadMore: Function,
  hasMore: boolean,
  isLoading: boolean,
  renderItem?: (item: Object) => React.Node,
};

const defaultRenderItem = (item: Object) => <ProductCard key={item.id} product={item} />;

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
      itemWidth="200px"
      isEmpty={items.length === 0}
      emptyMessage={
        <FormattedMessage id="modules.product.noProductFound" defaultMessage="No products found" />
      }
    >
      {items.map(item => renderItem(item))}
    </GridView>
  );
};

ProductGridView.defaultProps = defaultProps;

export default ProductGridView;
