// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { SectionHeader } from 'components/Form';
import { ContainerCard } from 'components/Cards';
import { SectionNavBar } from 'components/NavBar';
import QueryPlaceHolder from 'components/PlaceHolder/QueryPlaceHolder';
import ListCardPlaceHolder from 'components/PlaceHolder/ListCardPlaceHolder';
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
    <QueryPlaceHolder
      PlaceHolder={ListCardPlaceHolder}
      query={orderFormContainersQuery}
      entityId={entityId}
      isLoading={isLoading}
    >
      {({ data }) => {
        const containers = getByPathWithDefault([], 'order.containers', data);
        return (
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
        );
      }}
    </QueryPlaceHolder>
  );
}

export default ContainersSection;
