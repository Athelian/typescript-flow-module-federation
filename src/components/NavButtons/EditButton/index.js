// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import Icon from 'components/Icon';
import CustomButton from '../CustomButton';
import messages from '../messages';

type Props = {
  disabled?: boolean,
};

const EditButton = ({ disabled, ...rest }: Props) => (
  <CustomButton
    label={<FormattedMessage {...messages.edit} />}
    color="blue"
    icon={<Icon icon="EDIT" />}
    disabled={disabled}
    {...rest}
  />
);

EditButton.defaultProps = {
  disabled: false,
};

export default EditButton;
