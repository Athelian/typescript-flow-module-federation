// @flow
import * as React from 'react';
import * as Yup from 'yup';
import { FormattedMessage } from 'react-intl';

type Props = {
  name: string,
};

const validator = ({ name }: Props): Object =>
  Yup.object().shape({
    [name]: Yup.string().required(
      ((
        <FormattedMessage id="validation.name.required" defaultMessage="Name is a required field" />
      ): Object)
    ),
  });

export default validator;
