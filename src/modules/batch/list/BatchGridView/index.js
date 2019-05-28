// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import GridView from 'components/GridView';
import { BatchCard } from 'components/Cards';

type OptionalProps = {
  renderItem?: Function,
};

type Props = OptionalProps & {
  items: Array<Object>,
  onLoadMore: Function,
  hasMore: boolean,
  isLoading: boolean,
};

const defaultRenderItem = (item: Object) => <BatchCard key={item.id} batch={item} />;

const defaultProps = {
  renderItem: defaultRenderItem,
};

const BatchGridView = (props: Props) => {
  const { items, onLoadMore, hasMore, isLoading, renderItem = defaultRenderItem, ...rest } = props;

  return (
    <GridView
      onLoadMore={onLoadMore}
      hasMore={hasMore}
      isLoading={isLoading}
      itemWidth="195px"
      isEmpty={items.length === 0}
      emptyMessage={
        <FormattedMessage id="modules.Batches.noBatchesFound" defaultMessage="No batches found" />
      }
      {...rest}
    >
      {items.map(item => renderItem(item))}
    </GridView>
  );
};

BatchGridView.defaultProps = defaultProps;

export default BatchGridView;
