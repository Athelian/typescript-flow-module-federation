// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { BooleanValue } from 'react-values';
import { Subscribe } from 'unstated';
import GridView from 'components/GridView';
import { OrderFilteringContainer } from 'modules/relationMap/common/SortFilterBar/FilterForm/containers';
import PONoGridViewItem from './PONoGridViewItem';

type Props = {
  items: Array<Object>,
  onLoadMore: Function,
  hasMore: boolean,
  isLoading: boolean,
  renderItem?: Function,
};

const defaultRenderItem = (
  item: Object,
  onAddFilterValue: Function,
  onRemoveFilterValue: Function,
  isSelected: boolean
) => (
  <BooleanValue
    key={item.id}
    defaultValue={isSelected}
    onChange={selected => {
      if (selected) {
        onAddFilterValue('poNo', { id: item.id, text: item.poNo });
      } else {
        onRemoveFilterValue('poNo', { id: item.id, text: item.poNo });
      }
    }}
  >
    {({ value: selected, toggle: toggleSelect }) => (
      <PONoGridViewItem selected={selected} onToggle={toggleSelect}>
        {item.poNo}
      </PONoGridViewItem>
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
      <Subscribe to={[OrderFilteringContainer]}>
        {({ originalValues, state, onAddFilterValue, onRemoveFilterValue }) => (
          <GridView
            onLoadMore={onLoadMore}
            hasMore={hasMore}
            isLoading={isLoading}
            padding="10px 20px"
            itemWidth="calc(50% - 5px)"
            columnGap="10px"
            rowGap="5px"
            isEmpty={items.length === 0}
            emptyMessage={
              <FormattedMessage
                id="modules.relationMap.filter.emptyPONo"
                defaultMessage="No PO No. found"
              />
            }
          >
            {items.map(item => {
              const values = { ...originalValues, ...state };
              const selected = values.poNo.findIndex(el => el.id === item.id) !== -1;

              return renderItem(item, onAddFilterValue, onRemoveFilterValue, selected);
            })}
          </GridView>
        )}
      </Subscribe>
    );
  }
}

export default OrderGridView;
