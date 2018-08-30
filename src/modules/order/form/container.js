// @flow
import { Container } from 'unstated';
// import * as Yup from 'yup';

type FormState = {
  orderItems: Array<any>,
  files: Array<any>,
};

// const OrderSchema = Yup.object().shape({
//   poNo: Yup.string().required(),
//   currency: Yup.string().required(),
//   exporter: Yup.string().required(),
// });

export default class OrderFormContainer extends Container<FormState> {
  state = {
    orderItems: [],
    files: [],
  };

  setFieldValue = (name: string, value: mixed) => {
    this.setState({
      [name]: value,
    });
  };
}
