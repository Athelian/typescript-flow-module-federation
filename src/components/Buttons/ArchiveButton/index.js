// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { BaseButton } from 'components/Buttons';

type OptionalProps = {
  disabled: boolean,
  onClick: Function,
};

type Props = OptionalProps;

const defaultProps = {
  disabled: false,
  onClick: () => {},
};

const ArchiveButton = ({ disabled, onClick }: Props): React.Node => (
  <BaseButton
    icon="ARCHIVE"
    label={<FormattedMessage id="components.button.archive" defaultMessage="ARCHIVE" />}
    backgroundColor="GRAY"
    hoverBackgroundColor="GRAY_DARK"
    disabled={disabled}
    onClick={onClick}
  />
);

ArchiveButton.defaultProps = defaultProps;

export default ArchiveButton;
