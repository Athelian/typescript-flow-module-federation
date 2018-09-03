// @flow
import * as React from 'react';

type Props = {
  initValue: any,
  name: string,
  onValidate?: (value: any) => void,
  setFieldTouched: (field: string, isTouched: boolean) => void,
  setFieldValue: (field: string, value: any) => void,
  setActiveField: (field: string) => void,
  children: React.Node,
  validationOnChange?: boolean,
  validationOnBlur?: boolean,
};

type State = {
  value: any,
};

const defaultProps = {
  validationOnChange: false,
  validationOnBlur: false,
  onValidate: () => {},
};

export default class FormField extends React.Component<Props, State> {
  static defaultProps = defaultProps;

  constructor(props: Props) {
    super(props);

    const { initValue } = props;
    this.state = {
      value: initValue,
    };
  }

  onFocus = (event: SyntheticFocusEvent<*>) => {
    if (event.persist) {
      event.persist();
    }

    const { name, setActiveField } = this.props;
    setActiveField(name);
  };

  /**
   * Save local state on change, it could run validation
   */
  onChange = (event: SyntheticInputEvent<*>): void => {
    if (event.persist) {
      event.persist();
    }

    const { value } = event.target;
    this.setState({ value }, () => {
      const { validationOnChange, onValidate, name } = this.props;
      if (validationOnChange && onValidate) {
        onValidate({ [name]: value });
      }
    });
  };

  /**
   * Send the value to container/context when finish editing
   */
  onBlur = (event: SyntheticFocusEvent<*>) => {
    if (event.persist) {
      event.persist();
    }

    const { setFieldValue } = this.props;
    const { value } = this.state;
    const { name, validationOnBlur, onValidate, setFieldTouched, setActiveField } = this.props;
    if (validationOnBlur && onValidate) {
      onValidate({ [name]: value });
    }
    setFieldTouched(name, true);
    setActiveField('');
    setFieldValue(name, value);
  };

  render() {
    const { children, name } = this.props;
    const { value } = this.state;
    return children({
      name,
      value,
      onChange: this.onChange,
      onFocus: this.onFocus,
      onBlur: this.onBlur,
    });
  }
}
