// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import faSave from '@fortawesome/fontawesome-pro-solid/faCheckCircle';
import CustomButton from '../CustomButton';
import messages from '../messages';

type Props = {
  disabled?: boolean,
};

const SaveButton = ({ disabled, ...rest }: Props) => (
  <CustomButton
    label={<FormattedMessage {...messages.save} />}
    color="teal"
    icon={<FontAwesomeIcon icon={faSave} fixedWidth />}
    disabled={disabled}
    {...rest}
  />
);

SaveButton.defaultProps = {
  disabled: false,
};

export default SaveButton;
