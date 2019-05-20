// @flow
import * as React from 'react';
import { navigate } from '@reach/router';
import { Query } from 'react-apollo';
import { FormattedMessage } from 'react-intl';
import { SectionHeader } from 'components/Form';
import { ContainerCard } from 'components/Cards';
import { SectionNavBar } from 'components/NavBar';
import ListCardPlaceholder from 'components/PlaceHolder/ListCardPlaceHolder';
import { getByPathWithDefault } from 'utils/fp';
import {
  ContainersSectionWrapperStyle,
  ContainersSectionBodyStyle,
  EmptyMessageStyle,
} from './style';
import { orderFormContainersQuery } from './query';

type Props = {
  entityId: string,
  isLoading: boolean,
};

function ContainersSection({ entityId, isLoading }: Props) {
  return (
    <ListCardPlaceholder isLoading={isLoading}>
      <Query
        query={orderFormContainersQuery}
        variables={{
          id: entityId,
        }}
        fetchPolicy="network-only"
      >
        {({ loading, data, error }) => {
          if (error) {
            if (error.message && error.message.includes('403')) {
              navigate('/403');
            }

            return error.message;
          }
          if (loading) return <ListCardPlaceholder isLoading>Loading... </ListCardPlaceholder>;

          const containers = getByPathWithDefault([], 'order.containers', data);

          return (
            <>
              <SectionHeader
                icon="CONTAINER"
                title={
                  <>
                    <FormattedMessage id="modules.Orders.containers" defaultMessage="CONTAINERS" />{' '}
                    ({containers.length})
                  </>
                }
              />
              <div className={ContainersSectionWrapperStyle}>
                <SectionNavBar>
                  <div id="sortsandfilterswip" />
                </SectionNavBar>

                {containers.length === 0 ? (
                  <div className={EmptyMessageStyle}>
                    <FormattedMessage
                      id="modules.Orders.noContainersFound"
                      defaultMessage="No containers found"
                    />
                  </div>
                ) : (
                  <div className={ContainersSectionBodyStyle}>
                    {containers.map(container => (
                      <ContainerCard container={container} key={container.id} />
                    ))}
                  </div>
                )}
              </div>
            </>
          );
        }}
      </Query>
    </ListCardPlaceholder>
  );
}

export default ContainersSection;
