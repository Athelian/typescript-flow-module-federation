// @flow
import * as React from 'react';
import { useQuery } from '@apollo/react-hooks';
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
  const { data, loading, error, networkStatus } = useQuery(orderFormContainersQuery, {
    variables: {
      id: entityId,
    },
  });

  const refetching = networkStatus === 4;
  const containers = getByPathWithDefault([], 'order.containers', data);

  const showPlaceHolder = (loading && !refetching) || isLoading;

  if (error) return error.message;

  return (
    <ListCardPlaceholder isLoading={showPlaceHolder}>
      <>
        <SectionHeader
          icon="CONTAINER"
          title={
            <>
              <FormattedMessage id="modules.Orders.containers" defaultMessage="CONTAINERS" /> (
              {containers.length})
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
    </ListCardPlaceholder>
  );
}

export default ContainersSection;
