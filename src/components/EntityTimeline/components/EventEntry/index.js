// @flow
import * as React from 'react';
import Icon from 'components/Icon';
import type { Event } from 'components/EntityTimeline/type.js.flow';
import { WrapperStyle, IconStyle } from './style';
import UpdateEvent from './components/UpdateEvent';
import MultipleUpdateEvent from './components/MultipleUpdateEvent';
import DefaultEvent from './components/DefaultEvent';

type Props = {
  event: Event,
  entityType: string,
  translateField: string => any,
  formatValue: (string, string) => any,
  targetToIdentifier: Object => string,
  onTargetClick: Object => void,
};

const EventEntry = ({
  event,
  entityType,
  translateField,
  formatValue,
  targetToIdentifier,
  onTargetClick,
}: Props) => (
  <div className={WrapperStyle}>
    <div className={IconStyle}>
      <Icon icon="EDIT" />
    </div>
    {(() => {
      switch (event.type) {
        case 'Update':
          if (event.changes.length === 0) {
            return <DefaultEvent event={event} />;
          }
          if (event.changes.length === 1) {
            return (
              <UpdateEvent
                event={event}
                entityType={entityType}
                translateField={translateField}
                formatValue={formatValue}
                targetToIdentifier={targetToIdentifier}
                onTargetClick={onTargetClick}
              />
            );
          }
          return (
            <MultipleUpdateEvent
              event={event}
              entityType={entityType}
              translateField={translateField}
              formatValue={formatValue}
              targetToIdentifier={targetToIdentifier}
              onTargetClick={onTargetClick}
            />
          );
        default:
          return <DefaultEvent event={event} />;
      }
    })()}
  </div>
);

export default EventEntry;
