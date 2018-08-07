// @flow
import * as React from 'react';
import type { DefaultHTMLProps } from 'components/common/type.js.flow';
import OutsideClickHandler from 'components/OutsideClickHandler';

type Props = DefaultHTMLProps & {
  children: Function,
};

type State = {
  isEditMode: boolean,
};

export default class Editable extends React.Component<Props, State> {
  state = {
    isEditMode: false,
  };

  onToggleEditMode = (isEditMode: boolean) => {
    this.setState(() => ({ isEditMode }));
  };

  onClicks = () => {
    this.onToggleEditMode(true);
  };

  onOutsideClick = () => {
    const { isEditMode } = this.state;
    if (isEditMode) {
      this.onToggleEditMode(false);
    }
  };

  render() {
    const { children, ...rest } = this.props;
    const { isEditMode } = this.state;
    return (
      <OutsideClickHandler onOutsideClick={this.onOutsideClick}>
        <div {...rest} onClick={this.onClicks} role="presentation">
          {children(isEditMode, this.onToggleEditMode)}
        </div>
      </OutsideClickHandler>
    );
  }
}
