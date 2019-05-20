// @flow

import * as React from 'react';
import { navigate } from '@reach/router';
import { Query } from 'react-apollo';
import TaskSection from 'modules/task/common/TaskSection';
import ListCardPlaceHolder from 'components/PlaceHolder/ListCardPlaceHolder';
import { getByPathWithDefault } from 'utils/fp';
import { orderFormTasksQuery } from './query';

type Props = {
  isLoading: boolean,
  entityId: string,
  initValues: Object => void,
};

export default function OrderTasksSection({ isLoading, entityId, initValues }: Props) {
  return (
    <ListCardPlaceHolder isLoading={isLoading}>
      {entityId ? (
        <Query
          query={orderFormTasksQuery}
          variables={{
            id: entityId,
          }}
          fetchPolicy="network-only"
          onCompleted={result => {
            const todo = getByPathWithDefault({ tasks: [] }, 'order.todo', result);
            initValues(todo);
          }}
        >
          {({ loading, error }) => {
            if (error) {
              if (error.message && error.message.includes('403')) {
                navigate('/403');
              }

              return error.message;
            }
            if (loading) return <ListCardPlaceHolder isLoading>Loading... </ListCardPlaceHolder>;

            return <TaskSection entityId={entityId} type="order" />;
          }}
        </Query>
      ) : (
        <TaskSection entityId={entityId} type="order" />
      )}
    </ListCardPlaceHolder>
  );
}
