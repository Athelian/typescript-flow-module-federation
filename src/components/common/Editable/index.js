// @flow
import * as React from 'react';
import type { DefaultHTMLProps } from 'components/common/type.js.flow';
import OutsideClickHandler from 'components/OutsideClickHandler';

type Props = DefaultHTMLProps & {
  children: Function,
  editable: boolean,
};

type State = {
  isEditMode: boolean,
};

export default class Editable extends React.PureComponent<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      isEditMode: props.editable,
    };
  }

  onToggleEditMode = (isEditMode: boolean) => {
    const { editable } = this.props;
    this.setState(() => ({ isEditMode: isEditMode || editable }));
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
    const { children, editable, ...rest } = this.props;
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
