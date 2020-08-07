// @flow
import * as React from 'react';
import { Subscribe } from 'unstated';
import { isNullOrUndefined, getByPath } from 'utils/fp';
import withCache from 'hoc/withCache';
import FormContainer from './container';

type OptionalProps = {
  validationOnChange: boolean,
  validationOnBlur: boolean,
  saveOnChange: boolean,
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
  children: ({
    name: string,
    value: any,
    isTouched: boolean,
    errorMessage: string,
    isFocused: boolean,
    onChange: Function,
    onFocus: Function,
    onBlur: Function,
  }) => React.Node,
  setFieldValue: (field: string, value: any) => void,
};

type State = {
  value: any,
};

const defaultProps = {
  activeField: '',
  validationOnChange: false,
  validationOnBlur: true,
  saveOnChange: false,
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

    const { initValue: initialValue } = props;
    this.state = {
      value: isNullOrUndefined(initialValue) ? '' : initialValue,
    };
  }

  onFocus = (event: ?SyntheticFocusEvent<*>) => {
    if (event && event.persist) {
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
    const { validationOnChange, onValidate, saveOnChange, setFieldValue, name }: Props = this.props;

    this.setState({ value });

    if (validationOnChange && onValidate) {
      onValidate({ [name]: value });
    }

    if (saveOnChange) {
      setFieldValue(name, value);
    }
  };

  /**
   * Send the value to container/context when finish editing
   */
  onBlur = (event: any) => {
    if (event && event.persist) {
      event.persist();
    }

    let { value } = this.state;
    if (getByPath('currentTarget.type', event) === 'number') {
      value = getByPath('target.value', event);
      this.setState({
        value,
      });
    }

    if (event?.currentTarget?.type === 'datetime-local') {
      value = event?.target?.value;
      this.setState({
        value,
      });
    }

    const {
      name,
      validationOnBlur,
      onValidate,
      setFieldTouched,
      setActiveField,
      setFieldValue,
    } = this.props;
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
  'values',
]);

const FormField = (props: {
  initValue: any,
  name: string,
  setFieldValue?: (field: string, value: any) => void,
  values?: any,
  validator?: Object,
}) => {
  const { values, validator, setFieldValue, ...rest } = props;
  return (
    <Subscribe to={[FormContainer]}>
      {({
        state: { activeField, touched, errors },
        setFieldTouched,
        setActiveField,
        onValidation,
      }) => (
        <CachedField
          key={`field-${props.name}-${JSON.stringify(props.initValue)}`}
          values={values}
          activeField={activeField}
          isTouched={touched[props.name]}
          errorMessage={errors[props.name]}
          setFieldTouched={setFieldTouched}
          setActiveField={setActiveField}
          setFieldValue={setFieldValue}
          onValidate={newValue => onValidation({ ...values, ...newValue }, validator)}
          /* $FlowFixMe This comment suppresses an error found when upgrading
           * Flow to v0.112.0. To view the error, delete this comment and run
           * Flow. */
          {...rest}
        />
      )}
    </Subscribe>
  );
};

FormField.defaultProps = {
  validator: {
    validate: (value, options) => Promise.resolve({ value, options }),
  },
  setFieldValue: () => {},
  values: {},
};

export default FormField;
