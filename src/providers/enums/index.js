// @flow
import * as React from 'react';
import { Query } from 'react-apollo';
import LoadingIcon from 'components/LoadingIcon';
import query from './query';

type ContextProps = {
  Currency: Array<Object>,
  Incoterm: Array<Object>,
  LoadType: Array<Object>,
  TransportType: Array<Object>,
};

const initValues = {
  Currency: [],
  Incoterm: [],
  LoadType: [],
  TransportType: [],
};

export const EnumsContext: React.Context<ContextProps> = React.createContext(initValues);

type Props = {
  children: React.Node,
};

export const EnumsProvider = ({ children }: Props) => (
  <Query query={query} fetchPolicy="network-only">
    {({ error, loading, data }) => {
      if (error) {
        return error.message;
      }

      if (loading) return <LoadingIcon />;
      return <EnumsContext.Provider value={data || initValues}>{children}</EnumsContext.Provider>;
    }}
  </Query>
);

export const EnumsConsumer = EnumsContext.Consumer;
