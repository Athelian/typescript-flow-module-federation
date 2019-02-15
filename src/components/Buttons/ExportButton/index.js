// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { ApolloConsumer, Query, ApolloClient } from 'react-apollo';
import { BooleanValue } from 'react-values';
import { DocumentNode } from 'graphql';
import { BaseButton } from 'components/Buttons';
import LoadingIcon from 'components/LoadingIcon';
import Icon from 'components/Icon';
import OutsideClickHandler from 'components/OutsideClickHandler';
import { getByPathWithDefault } from 'utils/fp';
import logger from 'utils/logger';
import { UserConsumer } from 'modules/user';
import { ButtonStyle, DropDownStyle, WrapperStyle, ItemStyle, ItemIconStyle } from './style';
import { exportTemplatesQuery } from './query';

const DEMO_ACCOUNT_ID = 'baqcpn6hksk001ulcjpg';

type OptionalProps = {
  label: React.Node,
  disabled: boolean,
  dynamic: boolean | null,
  variables: Object,
};

type Props = OptionalProps & {
  type: string,
  exportQuery: DocumentNode,
};

type State = {
  isLoading: boolean,
};

class ExportButton extends React.Component<Props, State> {
  static defaultProps = {
    label: <FormattedMessage id="components.button.export" defaultMessage="EXPORT" />,
    disabled: false,
    dynamic: null,
    variables: {},
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

  doExport = (client: ApolloClient<any>, exportTemplateId: string) => {
    const { exportQuery, variables } = this.props;

    this.setState({ isLoading: true }, () => {
      client
        .query({
          query: exportQuery,
          variables: {
            templateId: exportTemplateId,
            ...variables,
          },
        })
        .then(({ data }) => {
          const link = document.createElement('a');
          link.href = data[exportQuery.definitions[0].selectionSet.selections[0].name.value].path;
          if (document.body) {
            document.body.appendChild(link);
            link.click();
          }
          if (document.body) document.body.removeChild(link);
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
    const { label, disabled, type, dynamic } = this.props;
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
                  <Query
                    query={exportTemplatesQuery}
                    variables={{
                      filterBy: {
                        type,
                        dynamic,
                      },
                    }}
                    fetchPolicy="network-only"
                  >
                    {({ data, loading }) => {
                      const templates = getByPathWithDefault([], 'exportTemplates', data);

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

                            <UserConsumer>
                              {({ user }) =>
                                !loading &&
                                type === 'Order' &&
                                user.id === DEMO_ACCOUNT_ID && (
                                  <button
                                    type="button"
                                    className={ItemStyle}
                                    onClick={() => {
                                      window.open(
                                        'https://storage.googleapis.com/zenport-public/Purchase%20Order%20%2020.pdf',
                                        '_blank'
                                      );
                                    }}
                                  >
                                    <div className={ItemIconStyle}>
                                      <Icon icon="PDF" />
                                    </div>
                                    <FormattedMessage
                                      id="components.buttons.orderPdf"
                                      defaultMessage="Order PDF"
                                    />
                                  </button>
                                )
                              }
                            </UserConsumer>

                            {!loading &&
                              (templates.length > 0 ? (
                                templates.map(template => (
                                  <button
                                    type="button"
                                    className={ItemStyle}
                                    key={template.id}
                                    onClick={() => {
                                      setOpen(false);
                                      this.doExport(client, template.id);
                                    }}
                                  >
                                    <div className={ItemIconStyle}>
                                      <Icon
                                        icon={
                                          ExportButton.extensionIcons[template.extension] || 'FILE'
                                        }
                                      />
                                    </div>
                                    {template.name}
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

export default ExportButton;
