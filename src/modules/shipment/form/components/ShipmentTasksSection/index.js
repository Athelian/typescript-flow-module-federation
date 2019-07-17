// @flow

import * as React from 'react';
import TaskSection from 'modules/task/common/TaskSection';
import QueryPlaceHolder from 'components/PlaceHolder/QueryPlaceHolder';
import ListCardPlaceHolder from 'components/PlaceHolder/ListCardPlaceHolder';
import { getByPathWithDefault } from 'utils/fp';
import { shipmentFormTasksQuery } from './query';

type Props = {|
  isLoading: boolean,
  entityId: string,
  groupIds: Array<string>,
  initValues: (Object, boolean) => void,
|};

export default function ShipmentTasksSection({ isLoading, entityId, groupIds, initValues }: Props) {
  return (
    <QueryPlaceHolder
      PlaceHolder={ListCardPlaceHolder}
      query={shipmentFormTasksQuery}
      entityId={entityId}
      isLoading={isLoading}
      onCompleted={result => {
        const todo = getByPathWithDefault({ tasks: [] }, 'shipment.todo', result);
        initValues(todo, true);
      }}
    >
      {() => {
        return <TaskSection groupIds={groupIds} entityId={entityId} type="Shipment" />;
      }}
    </QueryPlaceHolder>
  );
}
