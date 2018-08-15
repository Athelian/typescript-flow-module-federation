// @flow
import * as React from 'react';
import NavBar from '../NavBar';
import VirtualList from '../VirtualList';
import { ContentWrapperStyle, WrapperStyle, ItemWrapperStyle } from './style';

type Props = {
  itemCount: number,
  itemSize: number,
  hasMore: boolean,
  onThreshold: () => void,
  onEmpty: React.Node,
  children: (index: number) => React.Node,
  loading?: boolean,
  navBar?: React.Element<typeof NavBar>,
};

const defaultProps = {
  loading: true,
  navBar: null,
};

function ListWrapper(props: Props) {
  const { itemCount, itemSize, hasMore, onThreshold, onEmpty, loading, navBar, children } = props;
  return (
    <div className={WrapperStyle}>
      {navBar}
      <div className={ContentWrapperStyle}>
        <VirtualList
          itemCount={itemCount}
          itemSize={itemSize}
          hasMore={hasMore}
          onThreshold={onThreshold}
          onEmpty={onEmpty}
          loading={loading}
          horizontal={false}
          itemClassName={ItemWrapperStyle}
        >
          {index => children(index)}
        </VirtualList>
      </div>
    </div>
  );
}

ListWrapper.defaultProps = defaultProps;

export default ListWrapper;
