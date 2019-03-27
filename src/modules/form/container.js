// @flow
import { Container } from 'unstated';
import yupToFormErrors from 'utils/yupToFormErrors';
import logger from 'utils/logger';
import { isEquals, setIn } from 'utils/fp';

type FormState = {
  hasServerError: boolean,
  serverErrors: Object,
  errors: Object,
  touched: Object,
  activeField: string,
};

const EmptyValidation = {
  validate: (value: mixed, options: Object): Promise<any> => Promise.resolve({ value, options }),
  isValidSync: () => true,
};

const initState = {
  hasServerError: false,
  errors: {},
  serverErrors: {},
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
    const fieldsTouched = Object.keys(serverErrors).reduce(
      (result, field) => ({ ...result, [field]: true }),
      {}
    );

    this.setState({
      serverErrors,
      errors: serverErrors,
      touched: fieldsTouched,
      hasServerError: true,
    });
  };

  isReady = (
    formData: Object,
    schema: { isValidSync: any => boolean } = EmptyValidation
  ): boolean => schema.isValidSync(formData) && !this.state.hasServerError;

  onValidation = (
    formData: Object,
    schema: {
      validate: (any, any) => Promise<any>,
    } = EmptyValidation
  ) => {
    const { errors } = this.state;
    schema
      .validate(formData, { abortEarly: false })
      .then(() => {
        if (isEquals(Object.keys(formData), Object.keys(errors)) && Object.keys(errors).length) {
          this.setState({ errors: {}, hasServerError: false });
        } else {
          const remainErrors: Object = {};
          Object.keys(errors).forEach(field => {
            if (typeof formData[field] === 'undefined') {
              remainErrors[field] = errors[field];
            }
          });
          this.setState({
            errors: remainErrors,
            hasServerError: false,
          });
        }
      })
      .catch((yupErrors: Object) => {
        const newErrors = yupToFormErrors(yupErrors);
        if (!isEquals(Object.keys(formData), Object.keys(errors))) {
          const remainErrors: Object = {};
          Object.keys(errors).forEach(field => {
            if (typeof formData[field] === 'undefined') {
              remainErrors[field] = errors[field];
            }
          });
          this.setState({
            errors: { ...remainErrors, ...newErrors },
            hasServerError: false,
          });
        } else if (!isEquals(newErrors, errors)) {
          this.setState({
            errors: newErrors,
            hasServerError: false,
          });
        }
      });
  };
}
