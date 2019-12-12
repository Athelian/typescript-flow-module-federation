// @flow
import * as React from 'react';
import { useQuery, useMutation } from '@apollo/react-hooks';
import { FormattedMessage } from 'react-intl';
import { decodeId } from 'utils/id';
import { getByPathWithDefault } from 'utils/fp';
import Icon from 'components/Icon';
import FormattedNumber from 'components/FormattedNumber';
import { LogsButtonWrapperStyle, BadgeStyle } from './style';
import { unreadTimelineByEntity } from './query';
import { timelineReadByEntity } from './mutation';

type Props = {|
  onClick: Function,
  // prettier-ignore
  entityType: | 'order'
    | 'batch'
    | 'orderItem'
    | 'product'
    | 'productProvider'
    | 'project'
    | 'shipment'
    | 'container'
    | 'task',
  entityId: string,
|};

const LogsButton = ({ onClick, entityType, entityId }: Props) => {
  const { loading, data } = useQuery(unreadTimelineByEntity(entityType), {
    variables: {
      id: decodeId(entityId),
    },
  });
  const [timelineRead] = useMutation(timelineReadByEntity, {
    variables: {
      entity: {
        [`${entityType}Id`]: decodeId(entityId),
      },
    },
    refetchQueries: [
      {
        query: unreadTimelineByEntity(entityType),
        variables: {
          id: decodeId(entityId),
        },
      },
    ],
  });

  const badge = loading ? 0 : getByPathWithDefault(0, `${entityType}.timeline.unreadCount`, data);
  return (
    <button
      type="button"
      onClick={() => {
        if (badge) {
          timelineRead();
        }
        onClick();
      }}
      className={LogsButtonWrapperStyle}
    >
      <Icon icon="LOGS" />{' '}
      <FormattedMessage id="components.navBar.logsButton.logs" defaultMessage="LOGS" />
      {!!badge && badge > 0 && (
        <div className={BadgeStyle}>
          <FormattedNumber value={badge} />
        </div>
      )}
    </button>
  );
};

export default LogsButton;
