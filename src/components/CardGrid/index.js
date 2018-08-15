// @flow
import * as React from 'react';
import { RowStyle, WrapperStyle } from './style';

type Props = {
  itemsCount: number,
  itemsWidth: number,
  spaceWidth: number,
  paddingWidth: number,
  children: ({
    colCount: number,
    rowCount: number,
    width: number,
    newRow: (Array<React.Node>) => React.Node,
  }) => React.Node,
};

type State = {
  colCount: number,
  rowCount: number,
};

export default class CardGrid extends React.Component<Props, State> {
  state = {
    colCount: 0,
    rowCount: 0,
  };

  componentDidMount() {
    window.addEventListener('resize', this.updateGrid);
  }

  componentDidUpdate(prevProps: Props) {
    const { itemsCount, itemsWidth, spaceWidth, paddingWidth } = this.props;
    if (
      prevProps.itemsCount !== itemsCount ||
      prevProps.itemsWidth !== itemsWidth ||
      prevProps.spaceWidth !== spaceWidth ||
      prevProps.paddingWidth !== paddingWidth
    ) {
      this.updateGrid();
    }
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateGrid);
  }

  setWrapper = (wrapper: ?HTMLDivElement) => {
    if (wrapper) {
      this.wrapper = wrapper;
      this.updateGrid();
    }
  };

  updateGrid = () => {
    if (!this.wrapper) {
      return;
    }

    const { itemsCount, itemsWidth, spaceWidth, paddingWidth } = this.props;

    let width = this.wrapper.clientWidth - (paddingWidth + itemsWidth);
    let colCount = 1;
    while (width >= itemsWidth + spaceWidth) {
      width -= itemsWidth + spaceWidth;
      colCount += 1;
    }
    const rowCount = Math.max(Math.ceil(itemsCount / colCount), 0);

    this.setState({
      colCount,
      rowCount,
    });
  };

  wrapper: ?HTMLDivElement;

  render() {
    const { colCount, rowCount } = this.state;
    const { itemsWidth, spaceWidth, children } = this.props;

    return (
      <div ref={this.setWrapper} className={WrapperStyle}>
        {children({
          colCount,
          rowCount,
          width: this.wrapper ? this.wrapper.clientWidth : 0,
          newRow: items => <div className={RowStyle(itemsWidth, spaceWidth)}>{items}</div>,
        })}
      </div>
    );
  }
}
