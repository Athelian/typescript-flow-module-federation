// @flow
import * as React from 'react';
// import { FormattedMessage } from 'react-intl';
import Icon from 'components/Icon';
import CustomButton from '../CustomButton';
// import messages from '../messages';

type Props = {
  disabled?: boolean,
};

const SaveButton = ({ disabled, ...rest }: Props) => (
  <CustomButton label="NEW" color="teal" icon={<Icon icon="ADD" />} disabled={disabled} {...rest} />
);

SaveButton.defaultProps = {
  disabled: false,
};

export default SaveButton;
