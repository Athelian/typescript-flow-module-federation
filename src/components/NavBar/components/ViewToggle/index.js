// @flow
import * as React from 'react';
import Icon from 'components/Icon';
import { ViewToggleWrapperStyle, ViewButtonStyle } from './style';

type Props = {
  isTableView: boolean,
  changeToggle: Function,
  color: string,
};

class ViewToggle extends React.Component<Props> {
  onClick = (next: boolean) => {
    const { isTableView, changeToggle } = this.props;
    if (isTableView !== next) {
      changeToggle();
    }
  };

  render() {
    const { isTableView, color } = this.props;

    return (
      <div className={ViewToggleWrapperStyle}>
        <button
          onClick={() => this.onClick(false)}
          className={ViewButtonStyle(!isTableView, color)}
        >
          <Icon icon="fasWaterfall" />
        </button>
        <button onClick={() => this.onClick(true)} className={ViewButtonStyle(isTableView, color)}>
          <Icon icon="farTable" />
        </button>
      </div>
    );
  }
}

export default ViewToggle;
