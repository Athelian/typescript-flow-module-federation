// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import GridView from 'components/GridView';
import { TableTemplateCard } from 'components/Cards';

type Props = {
  items: Array<Object>,
  onLoadMore: Function,
  hasMore: boolean,
  isLoading: boolean,
  renderItem?: (item: Object) => React.Node,
};

const defaultRenderItem = (item: Object) => (
  <TableTemplateCard key={item.id} template={item} actions={[]} showActionsOnHover />
);

const defaultProps = {
  renderItem: defaultRenderItem,
};

const TableTemplateGridView = (props: Props) => {
  const { items, onLoadMore, hasMore, isLoading, renderItem = defaultRenderItem } = props;

  return (
    <GridView
      onLoadMore={onLoadMore}
      hasMore={hasMore}
      isLoading={isLoading}
      itemWidth="200px"
      isEmpty={items.length === 0}
      emptyMessage={
        <FormattedMessage id="modules.TableTemplates.noItem" defaultMessage="No template found" />
      }
    >
      {items.map(item => renderItem(item))}
    </GridView>
  );
};

TableTemplateGridView.defaultProps = defaultProps;

export default TableTemplateGridView;
