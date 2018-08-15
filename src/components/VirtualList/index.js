// @flow
import * as React from 'react';
import BaseVirtualList from 'react-tiny-virtual-list';
import LoadingIcon from 'components/LoadingIcon';
import { LoadingContentStyle, VirtualListStyle } from './style';

type Props = {
  itemCount: number,
  itemSize: number,
  hasMore: boolean,
  onThreshold: () => void,
  onEmpty: React.Node,
  children: (index: number) => React.Node,
  loading?: boolean,
  horizontal?: boolean,
  className?: any,
  itemClassName?: any,
};

const defaultProps = {
  loading: true,
  horizontal: false,
  className: null,
  itemClassName: null,
};

function VirtualList(props: Props) {
  const {
    itemCount,
    itemSize,
    hasMore,
    onThreshold,
    onEmpty,
    loading,
    children,
    horizontal,
    className,
    itemClassName,
  } = props;
  if (itemCount === 0) {
    if (loading) {
      return (
        <div className={className}>
          <div className={LoadingContentStyle}>
            <LoadingIcon />
          </div>
        </div>
      );
    }
    return onEmpty;
  }
  return (
    <BaseVirtualList
      scrollDirection={horizontal ? 'horizontal' : 'vertical'}
      height="100%"
      width="100%"
      itemCount={itemCount + (loading ? 1 : 0)}
      itemSize={itemSize}
      overscanCount={10}
      renderItem={({ index, style }) => {
        if (index < itemCount - (loading ? 1 : 0)) {
          return (
            <div className={itemClassName} style={style} key={index}>
              {children(index)}
            </div>
          );
        }

        if (index === itemCount - (loading ? 1 : 0)) {
          return (
            <div className={itemClassName} style={style} key={index}>
              <div className={LoadingContentStyle}>
                <LoadingIcon />
              </div>
            </div>
          );
        }

        return <div className={itemClassName} style={style} key={index} />;
      }}
      onItemsRendered={({ stopIndex }) => {
        if (stopIndex >= itemCount - 1 - (loading ? 1 : 0) && hasMore && !loading) {
          onThreshold();
        }
      }}
      className={className || VirtualListStyle}
    />
  );
}

VirtualList.defaultProps = defaultProps;

export default VirtualList;
