// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { BaseButton } from 'components/Buttons';
import { getExport } from 'utils/exporter';

type OptionalProps = {
  label: React.Node,
  disabled: boolean,
};

type Props = OptionalProps & {
  type: string,
  template: string,
  format: string,
  id?: string,
};

type State = {
  isLoading: boolean,
};

class ExportButton extends React.Component<Props, State> {
  static defaultProps = {
    label: <FormattedMessage id="components.button.export" defaultMessage="EXPORT" />,
    disabled: false,
  };

  state = {
    isLoading: false,
  };

  onClick = () => {
    const { type, format, template, id } = this.props;

    this.setState({ isLoading: true }, () => {
      getExport(
        {
          type,
          format,
          template,
          id,
        },
        () => {
          this.setState({ isLoading: false });
        },
        () => {
          // TODO: something went wrong, print error somewhere ?
          this.setState({ isLoading: false });
        }
      );
    });
  };

  render() {
    const { label, disabled } = this.props;
    const { isLoading } = this.state;

    return (
      <BaseButton
        icon="DOWNLOAD"
        label={label}
        backgroundColor="TEAL"
        hoverBackgroundColor="TEAL_DARK"
        disabled={disabled || isLoading}
        onClick={this.onClick}
      />
    );
  }
}

export default ExportButton;
