// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import faEdit from '@fortawesome/fontawesome-pro-solid/faPencil';
import CustomButton from '../CustomButton';
import messages from '../messages';

type Props = {
  disabled?: boolean,
};

const EditButton = ({ disabled, ...rest }: Props) => (
  <CustomButton
    label={<FormattedMessage {...messages.edit} />}
    color="blue"
    icon={<FontAwesomeIcon icon={faEdit} fixedWidth />}
    disabled={disabled}
    {...rest}
  />
);

EditButton.defaultProps = {
  disabled: false,
};

export default EditButton;
