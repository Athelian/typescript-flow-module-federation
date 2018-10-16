// @flow
import { Container } from 'unstated';
import yupToFormErrors from 'utils/yupToFormErrors';
import logger from 'utils/logger';
import { isEquals, setIn } from 'utils/fp';

type FormState = {
  hasServerError: boolean,
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
    logger.warn('validation', formData, schema);
    const { errors } = this.state;
    schema
      .validate(formData, { abortEarly: false })
      .then(() => {
        if (Object.keys(errors).length) this.setState({ errors: {}, hasServerError: false });
      })
      .catch((yupErrors: Object) => {
        const newErrors = yupToFormErrors(yupErrors);
        if (!isEquals(newErrors, errors))
          this.setState({
            errors: newErrors,
            hasServerError: false,
          });
      });
  };
}
