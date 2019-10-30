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
import type { InputProps } from '../../types';
import { LogsButtonStyle } from './style';

const LogsInput = ({
  query,
  queryField,
  entityKey,
}: {
  query: string,
  queryField: string,
  entityKey: string,
}) => {
  return ({ value, focus, onFocus, onBlur, onKeyDown, readonly }: InputProps<string>) => (
    <>
      <button
        tabIndex="-1"
        type="button"
        disabled={readonly}
        onClick={() => {
          if (!readonly) {
            onFocus();
          }
        }}
        onKeyDown={onKeyDown}
        className={LogsButtonStyle}
      >
        <Icon icon="LOGS" />
        <span>
          <FormattedMessage id="components.sheet.logs" defaultMessage="logs" />
        </span>
      </button>

      <SlideView isOpen={focus} onRequestClose={onBlur}>
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
    </>
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
};
