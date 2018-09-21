// @flow
import { Container } from 'unstated';
import yupToFormErrors from 'utils/yupToFormErrors';
import logger from 'utils/logger';
import { isEquals, setIn } from 'utils/fp';

type FormState = {
  errors: Object,
  touched: Object,
  activeField: string,
};

const EmptyValidation = {
  validate: (value, options) => Promise.resolve({ value, options }),
};

const initState = {
  errors: {},
  touched: {},
  activeField: '',
};

export default class FormContainer extends Container<FormState> {
  state = initState;

  setActiveField = (activeField: string) => {
    this.setState({ activeField });
  };

  setFieldTouched = (field: string) => {
    this.setState(prevState => ({
      touched: {
        ...prevState.touched,
        [field]: true,
      },
    }));
  };

  onReset = () => {
    logger.warn('onReset');
    this.setState(initState);
  };

  onErrors = (
    errors: Array<{
      code: string,
      message: string,
      path: string,
    }>
  ) => {
    const serverErrors = errors.reduce(
      (result, { path, message }) => setIn(path, message, result),
      {}
    );
    this.setState({
      errors: serverErrors,
    });
  };

  isReady = (formData: Object, schema: any = EmptyValidation) => schema.isValidSync(formData);

  onValidation = (formData: Object, schema: any = EmptyValidation) => {
    logger.warn('validation', formData, schema);
    const { errors } = this.state;
    schema
      .validate(formData, { abortEarly: false })
      .then(() => {
        if (Object.keys(errors).length) this.setState({ errors: {} });
      })
      .catch(yupErrors => {
        const newErrors = yupToFormErrors(yupErrors);
        if (!isEquals(newErrors, errors))
          this.setState({
            errors: newErrors,
          });
      });
  };
}
