// @flow
import * as React from 'react';
import { isEmpty } from 'utils/fp';
<<<<<<< HEAD
import scrollIntoView from 'utils/scrollIntoView';
=======
>>>>>>> feat(relation-map): scroll to view after action

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
    const { orderItem = {}, batch = {} } = result;
    if (!scrolled && (!isEmpty(orderItem) || !isEmpty(batch))) {

      const orderIds = Object.keys(orderItem);
      const orderItemIds = Object.keys(batch);
      const scrollOrderId = orderIds && orderIds.length > 0 ? orderIds[0] : '';
      const scrollOrderItemId = orderItemIds && orderItemIds.length > 0 ? orderItemIds[0] : '';
      const scrollOrderEl = document.getElementById(`item-${scrollOrderId}`);
      const scrollOrderItemEl = document.getElementById(`item-${scrollOrderItemId}`);
      if (scrollOrderEl || scrollOrderItemEl) {
        const scollId = scrollOrderId || scrollOrderItemId || '';
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
