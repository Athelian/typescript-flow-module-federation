// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { BooleanValue } from 'react-values';
import GridView from 'components/GridView';
import { OrderCard } from 'components/Cards';
import { OrderActivateDialog, OrderArchiveDialog } from 'modules/order/common/Dialog';

type Props = {
  items: Array<Object>,
  onLoadMore: Function,
  hasMore: boolean,
  isLoading: boolean,
  renderItem?: (item: Object) => React.Node,
};

const defaultRenderItem = (item: Object) => (
  <BooleanValue key={item.id}>
    {({ value: statusDialogIsOpen, set: dialogToggle }) => (
      <>
        {item.archived ? (
          <OrderActivateDialog
            onRequestClose={() => dialogToggle(false)}
            isOpen={statusDialogIsOpen}
            order={item}
          />
        ) : (
          <OrderArchiveDialog
            onRequestClose={() => dialogToggle(false)}
            isOpen={statusDialogIsOpen}
            order={item}
          />
        )}
        <OrderCard order={item} onArchive={() => dialogToggle(true)} />
      </>
    )}
  </BooleanValue>
);

const defaultProps = {
  renderItem: defaultRenderItem,
};

class OrderGridView extends React.PureComponent<Props> {
  static defaultProps = defaultProps;

  render() {
    const { items, onLoadMore, hasMore, isLoading, renderItem = defaultRenderItem } = this.props;

    return (
      <GridView
        onLoadMore={onLoadMore}
        hasMore={hasMore}
        isLoading={isLoading}
        itemWidth="195px"
        isEmpty={items.length === 0}
        emptyMessage={
          <FormattedMessage id="modules.order.noOrderFound" defaultMessage="No orders found" />
        }
      >
        {items.map(item => renderItem(item))}
      </GridView>
    );
  }
}

export default OrderGridView;
