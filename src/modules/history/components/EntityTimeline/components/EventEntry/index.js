// @flow
import * as React from 'react';
import { get } from 'lodash/fp';
import Icon from 'components/Icon';
import type { Entry } from 'modules/history/components/EntityTimeline/type.js.flow';
import { WrapperStyle, IconStyle } from './style';
import UpdateEvent from './components/UpdateEvent';
import MultipleUpdateEvent from './components/MultipleUpdateEvent';
import DefaultEvent from './components/DefaultEvent';

type Props = {
  event: Entry,
  entityType: string,
};

const EventEntry = ({ event, entityType }: Props) => (
  <div className={WrapperStyle}>
    <div className={IconStyle}>
      <Icon icon="EDIT" />
    </div>
    {(() => {
      switch (get('__typename', event)) {
        case 'EventChange':
          if (event.updates.length === 0) {
            return <DefaultEvent event={event} />;
          }
          if (event.updates.length === 1) {
            return <UpdateEvent event={event} entityType={entityType} />;
          }
          return <MultipleUpdateEvent event={event} entityType={entityType} />;
        default:
          return <DefaultEvent event={event} />;
      }
    })()}
  </div>
);

export default EventEntry;
