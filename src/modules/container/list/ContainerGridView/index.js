// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { navigate } from '@reach/router';
import { encodeId } from 'utils/id';
import GridView from 'components/GridView';
import { ContainerCard } from 'components/Cards';
import messages from 'modules/container/messages';
import PartnerPermissionsWrapper from 'components/PartnerPermissionsWrapper';
import { CONTAINER_FORM } from 'modules/permission/constants/container';
import { UserConsumer } from 'contexts/Viewer';
import type { UserPayload } from 'generated/graphql';

type OptionalProps = {
  renderItem?: (item: Object, user: UserPayload) => React.Node,
};

type Props = OptionalProps & {
  items: Array<Object>,
  onLoadMore: Function,
  hasMore: boolean,
  isLoading: boolean,
};

const defaultRenderItem = (item: Object, user: UserPayload) => (
  <PartnerPermissionsWrapper key={item.id} data={item}>
    {permissions => (
      <ContainerCard
        container={item}
        onClick={() => {
          if (permissions.includes(CONTAINER_FORM)) {
            navigate(`/container/${encodeId(item.id)}`);
          }
        }}
        user={user}
      />
    )}
  </PartnerPermissionsWrapper>
);

const defaultProps = {
  renderItem: defaultRenderItem,
};

const ContainerGridView = ({
  items,
  onLoadMore,
  hasMore,
  isLoading,
  renderItem = defaultRenderItem,
}: Props) => {
  return (
    <UserConsumer>
      {({ user }) => (
        <GridView
          onLoadMore={onLoadMore}
          hasMore={hasMore}
          isLoading={isLoading}
          itemWidth="195px"
          isEmpty={items.length === 0}
          emptyMessage={<FormattedMessage {...messages.noContainerFound} />}
        >
          {items.map(item => renderItem(item, user))}
        </GridView>
      )}
    </UserConsumer>
  );
};

ContainerGridView.defaultProps = defaultProps;

export default ContainerGridView;
