// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import GridView from 'components/GridView';
import { ContainerCard } from 'components/Cards';

type Props = {
  items: Array<Object>,
  onLoadMore: Function,
  hasMore: boolean,
  isLoading: boolean,
};

const ContainerGridView = ({ items, onLoadMore, hasMore, isLoading }: Props): React.Node => {
  return (
    <GridView
      onLoadMore={onLoadMore}
      hasMore={hasMore}
      isLoading={isLoading}
      itemWidth="195px"
      isEmpty={items.length === 0}
      padding="30px 0"
      emptyMessage={
        <FormattedMessage
          id="modules.Container.noContainersFound"
          defaultMessage="No containers found"
        />
      }
    >
      {items.map(item => (
        <ContainerCard key={item.id} container={item} />
      ))}
    </GridView>
  );
};

export default ContainerGridView;
