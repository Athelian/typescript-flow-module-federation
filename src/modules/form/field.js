// @flow
import * as React from 'react';
import { Subscribe } from 'unstated';
import { isNullOrUndefined } from 'utils/fp';
import withCache from 'hoc/withCache';
import FormContainer from './container';

type OptionalProps = {
  validationOnChange: boolean,
  validationOnBlur: boolean,
  isTouched: boolean,
  errorMessage: string,
  activeField: string,
  onValidate: (value: any) => void,
  setActiveField: (field: string) => void,
  setFieldTouched: (field: string, isTouched: boolean) => void,
};

type Props = OptionalProps & {
  initValue: any,
  name: string,
  children: React.Node,
  setFieldValue: (field: string, value: any) => void,
};

type State = {
  value: any,
};

const defaultProps = {
  activeField: '',
  validationOnChange: false,
  validationOnBlur: true,
  isTouched: false,
  errorMessage: '',
  onValidate: () => {},
  setActiveField: () => {},
  setFieldTouched: () => {},
};
class BaseFormField extends React.Component<Props, State> {
  static defaultProps = defaultProps;

  constructor(props: Props) {
    super(props);

    const { initValue } = props;
    this.state = {
      value: isNullOrUndefined(initValue) ? '' : initValue,
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
    setFieldTouched(name, true);
    setActiveField('');
    setFieldValue(name, value);
  };

  render() {
    const { children, name, activeField, isTouched, errorMessage } = this.props;
    const { value } = this.state;
    return children({
      name,
      value,
      isTouched,
      errorMessage,
      isFocused: name === activeField,
      onChange: this.onChange,
      onFocus: this.onFocus,
      onBlur: this.onBlur,
    });
  }
}

const CachedField = withCache(BaseFormField, [
  'activeField',
  'isTouched',
  'errorMessage',
  'initValue',
]);

const FormField = (props: {
  initValue: any,
  name: string,
  children: React.Node,
  setFieldValue?: (field: string, value: any) => void,
  values?: any,
  validationRules?: Function,
}) => {
  const { values, validationRules, setFieldValue, ...rest } = props;
  return (
    <Subscribe to={[FormContainer]}>
      {({
        state: { activeField, touched, errors },
        setFieldTouched,
        setActiveField,
        onValidation,
      }) => (
        <CachedField
          key={props.initValue}
          activeField={activeField}
          isTouched={touched[props.name]}
          errorMessage={errors[props.name]}
          setFieldTouched={setFieldTouched}
          setActiveField={setActiveField}
          setFieldValue={setFieldValue}
          onValidate={newValue =>
            onValidation({ ...values, ...newValue }, validationRules && validationRules())
          }
          {...rest}
        />
      )}
    </Subscribe>
  );
};

FormField.defaultProps = {
  validationRules: () => {},
  setFieldValue: () => {},
  values: {},
};

export default FormField;
