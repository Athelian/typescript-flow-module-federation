// @flow
import * as React from 'react';

type Props = {};

type State = {};

class OrderList extends React.Component<Props, State> {
  wrapper: ?HTMLDivElement;

  render() {
    return (
      <div
        ref={ref => {
          this.wrapper = ref;
        }}
      >
        Hello List View
      </div>
    );
  }
}

export default OrderList;
