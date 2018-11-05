// @flow
import * as React from 'react';
import { isEmpty } from 'utils/fp';

type Props = {
  id: string,
  result: Object,
  children: Function,
};
class ScrollToResult extends React.Component<Props> {
  scroll = () => {
    const { id, result } = this.props;
    const { orderItem = {}, batch = {} } = result;
    if (!this.scrolled && (!isEmpty(orderItem) || !isEmpty(batch))) {
      const orderIds = Object.keys(orderItem);
      const orderItemIds = Object.keys(batch);
      const scrollOrderId = orderIds && orderIds.length > 0 ? orderIds[0] : '';
      const scrollOrderItemId = orderItemIds && orderItemIds.length > 0 ? orderItemIds[0] : '';
      if (scrollOrderId || scrollOrderItemId) {
        const scollId = scrollOrderId || scrollOrderItemId || '';
        const scrollEl = document.getElementById(scollId);
        const top = scrollEl ? scrollEl.offsetTop : 0;
        const el: ?any = document.getElementById(id);
        if (el) {
          this.scrolled = true;
          el.scrollTo({ top: top - 200, behavior: 'smooth' });
        }
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
