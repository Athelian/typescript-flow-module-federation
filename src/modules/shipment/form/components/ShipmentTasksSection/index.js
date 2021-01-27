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
  entityOwnerId: string,
  groupIds: Array<string>,
  initValues: (Object, boolean) => void,
|};

export default function ShipmentTasksSection({
  isLoading,
  entityId,
  entityOwnerId,
  groupIds,
  initValues,
}: Props) {
  return (
    <QueryPlaceHolder
      PlaceHolder={() => <ListCardPlaceHolder height={613} />}
      query={shipmentFormTasksQuery}
      entityId={entityId}
      isLoading={isLoading}
      onCompleted={result => {
        const todo = getByPathWithDefault({ tasks: [] }, 'shipment.todo', result);
        initValues(todo, true);
      }}
    >
      {() => (
        <TaskSection
          groupIds={groupIds}
          entityId={entityId}
          entityOwnerId={entityOwnerId}
          type="Shipment"
        />
      )}
    </QueryPlaceHolder>
  );
}
