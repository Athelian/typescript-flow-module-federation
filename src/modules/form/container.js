// @flow
import { Container } from 'unstated';
import yupToFormErrors from 'utils/yupToFormErrors';
import logger from 'utils/logger';
import { isEquals } from 'utils/fp';

type FormState = {
  errors: Object,
  touched: Object,
  activeField: string,
};

export default class FormContainer extends Container<FormState> {
  state = {
    errors: {},
    touched: {},
    activeField: '',
  };

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

  isReady = () => {
    const { errors, touched } = this.state;
    return Object.keys(errors).length === 0 && Object.keys(touched).length > 0;
  };

  onValidation = (formData: Object, ValidationSchema: any) => {
    logger.warn('validation', formData);
    const { errors } = this.state;
    ValidationSchema.validate(formData, { abortEarly: false })
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
