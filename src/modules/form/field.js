// @flow
import * as React from 'react';

type OptionalProps = {
  validationOnChange: boolean,
  validationOnBlur: boolean,
  onValidate: (value: any) => void,
  setFieldValue: (field: string, value: any) => void,
};

type Props = OptionalProps & {
  initValue: any,
  name: string,
  setFieldTouched: (field: string, isTouched: boolean) => void,
  setActiveField: (field: string) => void,
  children: React.Node,
};

type State = {
  value: any,
};

const defaultProps = {
  validationOnChange: false,
  validationOnBlur: true,
  onValidate: () => {},
  setFieldValue: () => {},
};

export default class FormField extends React.Component<Props, State> {
  static defaultProps = defaultProps;

  constructor(props: Props) {
    super(props);

    const { initValue } = props;
    this.state = {
      value: initValue || '',
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
  onChange = (event: SyntheticInputEvent<*>) => {
    if (event.persist) {
      event.persist();
    }

    const { value } = event.target;
    const { validationOnChange, onValidate, name } = this.props;

    this.setState({ value }, () => {
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
    console.warn('name', name);
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
