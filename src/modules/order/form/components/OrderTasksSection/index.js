// @flow

import * as React from 'react';
import TaskSection from 'modules/task/common/TaskSection';
import QueryPlaceHolder from 'components/PlaceHolder/QueryPlaceHolder';
import ListCardPlaceHolder from 'components/PlaceHolder/ListCardPlaceHolder';
import { getByPathWithDefault } from 'utils/fp';
import { orderFormTasksQuery } from './query';

type Props = {
  isLoading: boolean,
  entityId: string,
  initValues: (Object, boolean) => void,
};

export default function OrderTasksSection({ isLoading, entityId, initValues }: Props) {
  return (
    <QueryPlaceHolder
      PlaceHolder={ListCardPlaceHolder}
      query={orderFormTasksQuery}
      entityId={entityId}
      isLoading={isLoading}
      onCompleted={result => {
        const todo = getByPathWithDefault({ tasks: [] }, 'order.todo', result);
        initValues(todo, true);
      }}
    >
      {() => {
        /* TODO: send partner ids */
        return <TaskSection groupIds={[]} entityId={entityId} type="order" />;
      }}
    </QueryPlaceHolder>
  );
}
