// @flow
import * as React from 'react';
import Icon from 'components/Icon';
import CustomButton from '../CustomButton';

type Props = {
  disabled?: boolean,
  title?: string,
};

const SaveButton = ({ title = 'NEW', disabled, ...rest }: Props) => (
  <CustomButton
    label={title}
    color="teal"
    icon={<Icon icon="ADD" />}
    disabled={disabled}
    {...rest}
  />
);

SaveButton.defaultProps = {
  disabled: false,
  title: 'NEW',
};

export default SaveButton;
