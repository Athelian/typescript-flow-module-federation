// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { ApolloClient } from 'react-apollo';
import { DocumentNode } from 'graphql';
import { getByPathWithDefault } from 'utils/fp';
import { exportTemplatesQuery } from './query';
import BaseExportButton from '../BaseExportButton';

const extensionIcons = {
  xls: 'EXCEL',
  xlsx: 'EXCEL',
  csv: 'CSV',
};

type OptionalProps = {
  label: React.Node,
  disabled: boolean,
  variables: Object,
};

type Props = OptionalProps & {
  type: string,
  exportQuery: DocumentNode,
};

const defaultProps = {
  label: <FormattedMessage id="components.button.export" defaultMessage="EXPORT" />,
  disabled: false,
  variables: {},
};

function ExportButton({ label, disabled, type, exportQuery, variables }: Props) {
  return (
    <BaseExportButton
      label={label}
      disabled={disabled}
      exportQuery={exportQuery}
      onLoad={(client: ApolloClient<any>) =>
        client
          // $FlowFixMe: For flow, variables in not valid
          .query({
            query: exportTemplatesQuery,
            variables: {
              filterBy: {
                type,
              },
            },
            fetchPolicy: 'network-only',
          })
          .then(({ data }) => {
            const templates = getByPathWithDefault([], 'exportTemplates', data);

            return templates.map(template => ({
              name: template.name,
              icon: extensionIcons[template.extension] || 'FILE',
              variables: {
                templateId: template.id,
                ...variables,
              },
            }));
          })
      }
    />
  );
}

ExportButton.defaultProps = defaultProps;

export default ExportButton;
