// @flow
import * as React from 'react';
import noop from 'lodash/noop';
import {
  RadioInputLabelStyle,
  RadioButtonStyle,
  RadioInputFilterFormWrapperStyle,
  RadioInputActionsWrapperStyle,
} from './style';

type OptionalProps = {
  readOnly: boolean,
  disabled: boolean,
  actions: Array<?React.Node>,
};

type Props = OptionalProps & {
  selected: boolean,
  onToggle: Function,
  children: React.Node,
};

const defaultProps = {
  readOnly: true,
  disabled: false,
  actions: [],
};

class RadioInputFilterForm extends React.PureComponent<Props> {
  static defaultProps = defaultProps;

  render() {
    const { selected, onToggle, children, disabled, readOnly, actions, ...rest } = this.props;

    return (
      <div className={RadioInputFilterFormWrapperStyle}>
        <div
          className={RadioInputLabelStyle(selected, disabled)}
          onClick={!disabled ? onToggle : noop}
          role="presentation"
        >
          <button className={RadioButtonStyle(selected, disabled)} type="button" {...rest} />
          {children}
        </div>
        {!readOnly ? <div className={RadioInputActionsWrapperStyle}>{actions}</div> : null}
      </div>
    );
  }
}

export default RadioInputFilterForm;
