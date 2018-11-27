// @flow
import * as React from 'react';
import { isEmpty } from 'utils/fp';
import scrollIntoView from 'utils/scrollIntoView';

type Props = {
  id: string,
  result: Object,
  children: Function,
  setScroll: Function,
  scrolled: boolean,
};
class ScrollToResult extends React.Component<Props> {
  scroll = () => {
    const { id, result, scrolled, setScroll } = this.props;
    const { order = [], orderItem = {}, batch = {} } = result;
    if (!scrolled && (order.length > 0 || !isEmpty(orderItem) || !isEmpty(batch))) {
      const orderIds = Object.keys(orderItem);
      const orderItemIds = Object.keys(batch);
      const scrollItemId = order && order.length > 0 ? order[0] : '';
      const scrollOrderId = orderIds && orderIds.length > 0 ? orderIds[0] : '';
      const scrollOrderItemId = orderItemIds && orderItemIds.length > 0 ? orderItemIds[0] : '';
      const scrollEl = document.getElementById(`item-${scrollItemId}`);
      const scrollOrderEl = document.getElementById(`item-${scrollOrderId}`);
      const scrollOrderItemEl = document.getElementById(`item-${scrollOrderItemId}`);
      if (scrollEl || scrollOrderEl || scrollOrderItemEl) {
        const scollId = scrollItemId || scrollOrderId || scrollOrderItemId || '';
        setTimeout(() => {
          setScroll(true);
          scrollIntoView({ targetId: `item-${scollId}`, boundaryId: id });
        }, 500);
      }
    }
  };

  componentDidMount = () => {
    this.scroll();
  };

  componentDidUpdate = () => {
    this.scroll();
  };

  scrolled: boolean;

  render() {
    const { children, id } = this.props;
    return children({ id });
  }
}

export default ScrollToResult;
