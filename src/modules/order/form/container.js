// @flow
import { Container } from 'unstated';
import * as Yup from 'yup';
import logger from 'utils/logger';
import yupToFormErrors from 'utils/yupToFormErrors';

type FormState = {
  formData: {
    items: Array<any>,
    files: Array<any>,
  },
  isReady: boolean,
  errors: Object,
};

const OrderSchema = Yup.object().shape({
  poNo: Yup.string().required(),
  currency: Yup.string().required(),
  exporter: Yup.string().required(),
});

export default class FormContainer extends Container<FormState> {
  state = {
    formData: {
      items: [],
      files: [],
    },
    errors: {},
    isReady: false,
  };

  onChangeField = (name: string, value: mixed, cb: Function = () => {}) => {
    logger.warn('change field', name, value, this.state);
    this.setState(
      prevState => ({
        ...prevState,
        [name]: value,
      }),
      () => cb()
    );
  };

  onValidation = () => {
    logger.warn('try to validate', this.state);
    const { formData } = this.state;
    OrderSchema.validate(formData, { abortEarly: false })
      .then(() => {
        this.setState({ errors: {} });
      })
      .catch(yupErrors => {
        this.setState({
          errors: yupToFormErrors(yupErrors),
        });
      });
  };

  onSubmit = (evt: Event) => {
    evt.preventDefault();
    logger.warn('try to submit', this.state);
    this.onValidation();
    // TODO: call on save
  };

  onFinish = () => this.setState({ isReady: false });
}
