// @flow
import { Container } from 'unstated';
import { yupToFormErrors } from 'utils/errors';
import { isEquals, setIn } from 'utils/fp';
import emitter from 'utils/emitter';

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
    const { serverErrors, touched } = this.state;
    if (serverErrors[field]) {
      delete serverErrors[field];
    }
    this.setState({
      serverErrors,
      touched: {
        ...touched,
        [field]: true,
      },
    });
  };

  onReset = () => {
    emitter.emit('VALIDATION_ERROR', true);
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
      isValidSync: (any, any) => boolean,
    } = EmptyValidation
  ): boolean => {
    const { errors, serverErrors } = this.state;
    const isValid = schema?.isValidSync?.(formData);
    schema
      .validate(formData, { abortEarly: false })
      .then(() => {
        const remainErrors: Object = { ...serverErrors };
        Object.keys(errors).forEach(field => {
          if (typeof formData[field] === 'undefined') {
            remainErrors[field] = errors[field];
          }
        });

        this.setState({
          errors: remainErrors,
          hasServerError: Object.keys(serverErrors).length > 0,
        });
      })
      .catch((yupErrors: Object) => {
        const newErrors = yupToFormErrors(yupErrors);
        if (!isEquals(Object.keys(formData), Object.keys(errors))) {
          const remainErrors: Object = { ...serverErrors };
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
            hasServerError: Object.keys(serverErrors).length > 0,
          });
        }
      });
    emitter.emit('VALIDATION_ERROR', isValid);
    return isValid;
  };
}
