// @flow
import * as React from 'react';
import { navigate } from '@reach/router';
import { FormattedMessage } from 'react-intl';
import { BooleanValue } from 'react-values';
import { encodeId } from 'utils/id';
import GridView from 'components/GridView';
import { OrderCard, CardAction } from 'components/Cards';
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
        <OrderCard
          order={item}
          actions={[
            <CardAction
              icon="CLONE"
              onClick={() => navigate(`/order/clone/${encodeId(item.id)}`)}
            />,
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
