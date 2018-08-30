// @flow
import { Container } from 'unstated';
import yupToFormErrors from 'utils/yupToFormErrors';

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

  onValidation = (formData: Object, ValidationSchema: any) => {
    ValidationSchema.validate(formData, { abortEarly: false })
      .then(() => {
        this.setState({ errors: {} });
      })
      .catch(yupErrors => {
        this.setState({
          errors: yupToFormErrors(yupErrors),
        });
      });
  };
}
