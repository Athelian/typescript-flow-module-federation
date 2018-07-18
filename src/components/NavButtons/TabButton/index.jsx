// @flow
import * as React from 'react';
import { Link, Route } from 'react-router-dom';
import { TabButtonStyle, TabButtonDisabledStyle } from './style';

type Props = {
  to: string,
  path: string,
  disabled?: boolean,
  onActive?: () => void,
};

class TabButton extends React.Component<Props> {
  static defaultProps = {
    disabled: false,
    onActive: () => {},
  };

  onClick = (match: ?any, e: Event) => {
    const { disabled } = this.props;
    if (match || disabled) {
      e.preventDefault();
    }
  };

  render() {
    const { to, path, disabled, onActive, ...rest } = this.props;

    return (
      <Route exact path={path}>
        {({ match }) => {
          if (match && onActive) {
            onActive();
          }

          return (
            <Link
              to={to}
              replace
              onClick={(e: Event) => this.onClick(match, e)}
              className={disabled ? TabButtonDisabledStyle : TabButtonStyle(match)}
              tabIndex={disabled ? -1 : 0}
              {...rest}
            />
          );
        }}
      </Route>
    );
  }
}

export default TabButton;
