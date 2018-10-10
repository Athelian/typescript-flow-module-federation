// @flow
import * as React from 'react';
import { TotalCardWrapperStyle } from '../style';

type Props = {
  quantity: number,
  name: string,
};
class TotalCard extends React.PureComponent<Props> {
  render() {
    const { quantity, name } = this.props;
    return (
      <div className={TotalCardWrapperStyle}>
        <span>
          Total {quantity} {name}
        </span>
        <span>ALL</span>
      </div>
    );
  }
}
export default TotalCard;
