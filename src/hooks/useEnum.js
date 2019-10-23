// @flow
import { useApolloClient } from '@apollo/react-hooks';
import { enumQuery } from 'graphql/common/enum';
import * as React from 'react';

type Enum = {
  name: string,
  description: string,
};

export default function useEnum(enumName: ?string): { enums: Array<Enum>, loading: boolean } {
  const client = useApolloClient();
  const [loading, setLoading] = React.useState<boolean>(false);
  const [enums, setEnums] = React.useState<Array<Enum>>([]);

  React.useEffect(() => {
    setEnums([]);
    if (!enumName) {
      return;
    }

    setLoading(true);

    client
      .query({
        query: enumQuery,
        variables: { enum: enumName },
        fetchPolicy: 'cache-first',
      })
      .then(({ data }) => {
        setEnums(data?.__type?.enumValues ?? []);
        setLoading(false);
      });
  }, [client, enumName]);

  return {
    loading,
    enums,
  };
}
