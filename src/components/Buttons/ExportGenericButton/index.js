// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { ApolloConsumer, Query, ApolloClient } from 'react-apollo';
import { BooleanValue } from 'react-values';
import { BaseButton } from 'components/Buttons';
import LoadingIcon from 'components/LoadingIcon';
import OutsideClickHandler from 'components/OutsideClickHandler';
import { getByPathWithDefault } from 'utils/fp';
import logger from 'utils/logger';
import { ButtonStyle, DropDownStyle, WrapperStyle, ItemStyle } from './style';
import { exportExtensionsQuery, genericExportQuery } from './query';

type OptionalProps = {
  label: React.Node,
  disabled: boolean,
};

type Props = OptionalProps & {
  columns: Array<String>,
  rows: Array<Array<?String>>,
};

type State = {
  isLoading: boolean,
};

class ExportGenericButton extends React.Component<Props, State> {
  static defaultProps = {
    label: <FormattedMessage id="components.button.export" defaultMessage="EXPORT" />,
    disabled: false,
  };

  static extensionIcons = {
    xls: 'EXCEL',
    xlsx: 'EXCEL',
    csv: 'CSV',
  };

  constructor() {
    super();
    this.state = {
      isLoading: false,
    };
    this.buttonRef = React.createRef();
  }

  doExport = (client: ApolloClient<any>, extension: string) => {
    const { columns, rows } = this.props;

    this.setState({ isLoading: true }, () => {
      client
        .query({
          query: genericExportQuery,
          // $FlowFixMe: it's bullshit
          variables: {
            extension,
            columns,
            rows,
          },
        })
        .then(({ data }) => {
          const link = document.createElement('a');
          link.href = data.genericExport.path;
          if (document.body) {
            document.body.appendChild(link);
            link.click();
          }
          if (document.body) {
            document.body.removeChild(link);
          }
        })
        .catch(reason => {
          logger.error(reason);
        })
        .finally(() => {
          this.setState({ isLoading: false });
        });
    });
  };

  buttonRef: any;

  render() {
    const { label, disabled } = this.props;
    const { isLoading } = this.state;
    return (
      <ApolloConsumer>
        {client => (
          <BooleanValue>
            {({ value: isOpen, set: setOpen }) => (
              <div className={WrapperStyle}>
                <BaseButton
                  icon="DOWNLOAD"
                  label={label}
                  textColor="GRAY_LIGHT"
                  backgroundColor="WHITE"
                  hoverBackgroundColor="GRAY_SUPER_LIGHT"
                  className={ButtonStyle}
                  isLoading={isLoading}
                  disabled={disabled}
                  onClick={() => setOpen(!isOpen)}
                  buttonRef={this.buttonRef}
                />
                {isOpen && (
                  <Query query={exportExtensionsQuery} fetchPolicy="network-only">
                    {({ data, loading }) => {
                      const extensions = getByPathWithDefault([], 'exportExtensions', data);

                      return (
                        <OutsideClickHandler
                          onOutsideClick={() => setOpen(false)}
                          ignoreClick={!isOpen}
                          ignoreElements={
                            this.buttonRef && this.buttonRef.current ? [this.buttonRef.current] : []
                          }
                        >
                          <div className={DropDownStyle}>
                            {loading && (
                              <div className={ItemStyle}>
                                <LoadingIcon size={10} />
                              </div>
                            )}
                            {!loading &&
                              (extensions.length > 0 ? (
                                extensions.map(extension => (
                                  <button
                                    type="button"
                                    className={ItemStyle}
                                    key={extension.extension}
                                    onClick={() => {
                                      setOpen(false);
                                      this.doExport(client, extension.extension);
                                    }}
                                  >
                                    .{extension.extension}
                                  </button>
                                ))
                              ) : (
                                <div className={ItemStyle}>
                                  <FormattedMessage
                                    id="components.button.export.noTemplates"
                                    defaultMessage="No export available"
                                  />
                                </div>
                              ))}
                          </div>
                        </OutsideClickHandler>
                      );
                    }}
                  </Query>
                )}
              </div>
            )}
          </BooleanValue>
        )}
      </ApolloConsumer>
    );
  }
}

export default ExportGenericButton;
