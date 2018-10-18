// @flow
import * as React from 'react';
import Icon from 'components/Icon';
import {
  IncrementInputWrapperStyle,
  IncrementButtonStyle,
  IncrementContentStyle,
} from 'components/IncrementInput/style';

type Props = {
  value: number,
  onChange: (value: number) => void,
};

export default class IncrementInput extends React.Component<Props> {
  static defaultProps = {
    value: 0,
    onChange: () => {},
  };

  handleMinus = () => {
    const { value, onChange } = this.props;
    if (value > 0) {
      onChange(value - 1);
    } else {
      onChange(0);
    }
  };

  handlePlus = () => {
    const { value, onChange } = this.props;
    onChange(value + 1);
  };

  render() {
    const { value } = this.props;

    return (
      <div className={IncrementInputWrapperStyle}>
        <button
          data-testid="decreaseButton"
          className={IncrementButtonStyle}
          onClick={this.handleMinus}
          type="button"
        >
          <Icon icon="MINUS" />
        </button>
        <input className={IncrementContentStyle} type="number" readOnly min={0} value={value} />
        <button
          data-testid="increaseButton"
          className={IncrementButtonStyle}
          onClick={this.handlePlus}
          type="button"
        >
          <Icon icon="ADD" />
        </button>
      </div>
    );
  }
}
