// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import SlideView from 'components/SlideView';
import { Content, SlideViewLayout, SlideViewNavBar } from 'components/Layout';
import { EntityIcon } from 'components/NavBar';
import Icon from 'components/Icon';
import { Display } from 'components/Form';
import Timeline from 'modules/timeline/components/Timeline';
import { orderTimelineQuery } from 'modules/order/query';
import { orderItemTimelineQuery } from 'modules/orderItem/form/query';
import { shipmentTimelineQuery } from 'modules/shipment/query';
import type { InputProps } from '../../types';
import { InputWrapperStyle } from './style';

const LogsButton = (entityType: string) => {
  return ({ value, focus, onFocus, onBlur, onKeyDown, readonly }: InputProps<string>) => {
    const timelineQueryPropMap = {
      Order: {
        query: orderTimelineQuery,
        queryField: 'order',
        entity: {
          orderId: value,
        },
        variables: {
          id: value,
        },
      },
      OrderItem: {
        query: orderItemTimelineQuery,
        queryField: 'orderItem',
        entity: {
          orderItemId: value,
        },
        variables: {
          id: value,
        },
      },
      Shipment: {
        query: shipmentTimelineQuery,
        queryField: 'shipment',
        entity: {
          shipmentId: value,
        },
        variables: {
          id: value,
        },
      },
    };
    return (
      <>
        <button
          tabIndex="-1"
          type="button"
          onClick={() => {
            if (!readonly) {
              onFocus();
            }
          }}
          onKeyDown={onKeyDown}
          className={InputWrapperStyle}
        >
          <Icon icon="LOGS" />
          <Display>
            <FormattedMessage id="components.sheet.logs" defaultMessage="logs" />
          </Display>
        </button>

        <SlideView isOpen={focus} onRequestClose={onBlur}>
          <SlideViewLayout>
            {focus && (
              <>
                <SlideViewNavBar>
                  <EntityIcon icon="LOGS" color="LOGS" />
                </SlideViewNavBar>

                <Content>
                  <Timeline {...timelineQueryPropMap[entityType]} />
                </Content>
              </>
            )}
          </SlideViewLayout>
        </SlideView>
      </>
    );
  };
};

export default {
  Order: LogsButton('Order'),
  OrderItem: LogsButton('OrderItem'),
  Shipment: LogsButton('Shipment'),
};
