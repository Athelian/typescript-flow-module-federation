// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import GridView from 'components/GridView';
import { ContainerCard } from 'components/Cards';
import messages from 'modules/container/messages';

type Props = {
  items: Array<Object>,
  onLoadMore: Function,
  hasMore: boolean,
  isLoading: boolean,
  renderItem?: (item: Object) => React.Node,
};

const defaultRenderItem = (item: Object) => <ContainerCard container={item} />;

const defaultProps = {
  renderItem: defaultRenderItem,
};

class ContainerGridView extends React.PureComponent<Props> {
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
        emptyMessage={<FormattedMessage {...messages.noContainerFound} />}
      >
        {items.map(item => renderItem(item))}
      </GridView>
    );
  }
}

export default ContainerGridView;
