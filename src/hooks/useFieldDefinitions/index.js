// @flow
import * as React from 'react';
import { useApolloClient } from '@apollo/react-hooks';
import type { FieldDefinition } from 'types';
import logger from 'utils/logger';
import { fieldDefinitionsQuery } from './query';

export default function useFieldDefinitions(
  entityTypes: Array<string>
): { fieldDefinitions: { [string]: Array<FieldDefinition> }, loading: boolean } {
  const client = useApolloClient();
  const [loading, setLoading] = React.useState(true);
  const [fieldDefinitions, setFieldDefinitions] = React.useState<{
    [string]: Array<FieldDefinition>,
  }>({});

  React.useEffect(() => {
    Promise.all(
      entityTypes.map(
        entityType =>
          client
            .query({
              query: fieldDefinitionsQuery,
              fetchPolicy: 'network-only',
              variables: {
                entityType,
              },
            })
            .then(({ data }) => {
              return data?.fieldDefinitions ?? [];
            })
            .catch(error => {
              logger.warn({
                error,
              });
            }),
        {}
      )
    )
      .then(result => {
        setFieldDefinitions(
          result.reduce(
            (o, fds, idx) => ({
              ...o,
              [entityTypes[idx]]: fds,
            }),
            {}
          )
        );
        setLoading(false);
      })
      .catch(error => {
        logger.warn({
          error,
        });
      });
  }, [client, entityTypes]);

  return {
    fieldDefinitions,
    loading,
  };
}