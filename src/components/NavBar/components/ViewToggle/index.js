// @flow
import * as React from 'react';
import Icon from 'components/Icon';
import { ViewToggleWrapperStyle, ViewButtonStyle } from './style';

type Props = {
  viewTypes: Array<{
    icon: string,
    type: 'grid' | 'list' | 'table',
  }>,
  selectedView: string,
  changeToggle: Function,
};

class ViewToggle extends React.Component<Props> {
  onClick = (viewType: string) => {
    const { changeToggle } = this.props;
    changeToggle(viewType);
  };

  render() {
    const { selectedView, viewTypes } = this.props;

    return (
      <div className={ViewToggleWrapperStyle}>
        {viewTypes.map(({ icon, type }) => (
          <button
            key={type}
            type="button"
            onClick={() => this.onClick(type)}
            className={ViewButtonStyle(selectedView === type)}
          >
            <Icon icon={icon} />
          </button>
        ))}
      </div>
    );
  }
}

export default ViewToggle;
