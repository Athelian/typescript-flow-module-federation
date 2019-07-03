// @flow
import * as React from 'react';
import * as Yup from 'yup';
import { FormattedMessage } from 'react-intl';

const validator = ({ no }: { no: string }): Object =>
  Yup.object().shape({
    [no]: Yup.string().required(
      (<FormattedMessage id="validation.no.required" defaultMessage="No is required field" />: any)
    ),
  });

export default validator;
