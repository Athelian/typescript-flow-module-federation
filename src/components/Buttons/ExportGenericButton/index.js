// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { ApolloClient } from 'react-apollo';
import { getByPathWithDefault } from 'utils/fp';
import { genericExportQuery, exportExtensionsQuery } from './query';
import BaseExportButton from '../BaseExportButton';

type OptionalProps = {
  label: React.Node,
  disabled: boolean,
};

type Props = OptionalProps & {
  columns: Array<string> | (() => Array<string>),
  rows: Array<Array<?string>> | (() => Array<Array<?string>>),
};

const defaultProps = {
  label: <FormattedMessage id="components.button.export" defaultMessage="EXPORT" />,
  disabled: false,
};

function ExportGenericButton({ label, disabled, rows, columns }: Props) {
  return (
    <BaseExportButton
      label={label}
      disabled={disabled}
      exportQuery={genericExportQuery}
      onLoad={(client: ApolloClient<any>) =>
        client
          .query({
            query: exportExtensionsQuery,
            fetchPolicy: 'network-only',
          })
          .then(({ data }) => {
            const extensions = getByPathWithDefault([], 'exportExtensions', data);

            return extensions.map(extension => ({
              name: `.${extension.extension}`,
              icon: null,
              variables: {
                extension: extension.extension,
                columns: typeof columns === 'function' ? columns() : columns,
                rows: typeof rows === 'function' ? rows() : rows,
              },
            }));
          })
      }
    />
  );
}

ExportGenericButton.defaultProps = defaultProps;

export default ExportGenericButton;
