// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import SlideView from 'components/SlideView';
import { Content, SlideViewLayout, SlideViewNavBar } from 'components/Layout';
import { EntityIcon } from 'components/NavBar';
import Icon from 'components/Icon';
import Timeline from 'modules/timeline/components/Timeline';
import { orderTimelineQuery } from 'modules/order/query';
import { orderItemTimelineQuery } from 'modules/orderItem/form/query';
import { batchTimelineQuery } from 'modules/batch/form/query';
import { shipmentTimelineQuery } from 'modules/shipment/query';
import { containerTimelineQuery } from 'modules/container/query';
import { projectTimelineQuery } from 'modules/project/query';
import { taskTimelineQuery } from 'modules/task/query';
import type { InputProps } from 'components/Sheet/CellRenderer/Cell/CellInput/types';
import { LogsButtonStyle } from './style';

const LogsInput = ({
  query,
  queryField,
  entityKey,
}: {
  query: string,
  queryField: string,
  entityKey: string,
}) => ({ value, focus, forceFocus, forceBlur, readonly }: InputProps<string>) => {
  const handleBlur = (e: SyntheticFocusEvent<HTMLElement>) => {
    if (focus) {
      e.stopPropagation();
      e.preventDefault();
    }
  };

  return (
    <div onBlur={handleBlur}>
      <button type="button" disabled={readonly} onClick={forceFocus} className={LogsButtonStyle}>
        <Icon icon="LOGS" />
        <span>
          <FormattedMessage id="components.sheet.logs" defaultMessage="logs" />
        </span>
      </button>

      <SlideView isOpen={focus} onRequestClose={forceBlur}>
        <SlideViewLayout>
          {focus && (
            <>
              <SlideViewNavBar>
                <EntityIcon icon="LOGS" color="LOGS" />
              </SlideViewNavBar>

              <Content>
                <Timeline
                  query={query}
                  queryField={queryField}
                  entity={{ [entityKey]: value }}
                  variables={{ id: value }}
                />
              </Content>
            </>
          )}
        </SlideViewLayout>
      </SlideView>
    </div>
  );
};

export default {
  Order: LogsInput({
    query: orderTimelineQuery,
    queryField: 'order',
    entityKey: 'orderId',
  }),
  OrderItem: LogsInput({
    query: orderItemTimelineQuery,
    queryField: 'orderItem',
    entityKey: 'orderItemId',
  }),
  Batch: LogsInput({
    query: batchTimelineQuery,
    queryField: 'batch',
    entityKey: 'batchId',
  }),
  Shipment: LogsInput({
    query: shipmentTimelineQuery,
    queryField: 'shipment',
    entityKey: 'shipmentId',
  }),
  Container: LogsInput({
    query: containerTimelineQuery,
    queryField: 'container',
    entityKey: 'containerId',
  }),
  Project: LogsInput({
    query: projectTimelineQuery,
    queryField: 'project',
    entityKey: 'projectId',
  }),
  Task: LogsInput({
    query: taskTimelineQuery,
    queryField: 'task',
    entityKey: 'taskId',
  }),
};
