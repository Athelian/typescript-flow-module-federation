// @flow
import * as React from 'react';

type Props = {
  initValue: any,
  name: string,
  onFinish: (value: any) => void,
  setFieldTouched: (field: string, isTouched: boolean) => void,
  setActiveField: (field: string) => void,
  children: React.Node,
};

type State = {
  value: any,
};

export default class FormField extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    const { initValue } = props;
    this.state = {
      value: initValue,
    };
  }

  onFocus = () => {
    const { name, setActiveField } = this.props;
    setActiveField(name);
  };

  /**
   * Save local state on change, it could run validation
   */
  onChange = (value: any) => {
    this.setState({ value });
  };

  /**
   * Send the value to container/context when finish editing
   */
  onBlur = () => {
    const { onFinish } = this.props;
    const { value } = this.state;
    const { name, setFieldTouched, setActiveField } = this.props;
    setFieldTouched(name, true);
    setActiveField('');
    onFinish(value);
  };

  render() {
    const { children } = this.props;
    const { value } = this.state;
    return children({
      value,
      onChange: this.onChange,
      onFocus: this.onFocus,
      onBlur: this.onBlur,
    });
  }
}
