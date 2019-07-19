// @flow
import * as React from 'react';
import type { ContainerPayload } from 'generated/graphql';
import { FormattedMessage } from 'react-intl';
import { navigate } from '@reach/router';
import { getByPath } from 'utils/fp';
import { encodeId } from 'utils/id';
import { SectionHeader } from 'components/Form';
import { ContainerCard } from 'components/Cards';
import { SectionNavBar } from 'components/NavBar';
import ListCardPlaceHolder from 'components/PlaceHolder/ListCardPlaceHolder';
import {
  ContainersSectionWrapperStyle,
  ContainersSectionBodyStyle,
  EmptyMessageStyle,
} from './style';

type Props = {|
  isReady: boolean,
  containers: Array<ContainerPayload>,
|};

function ContainersSection({ isReady, containers }: Props) {
  return !isReady ? (
    <ListCardPlaceHolder />
  ) : (
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
              <ContainerCard
                key={getByPath('id', container)}
                container={container}
                onClick={() => navigate(`/container/${encodeId(getByPath('id', container))}`)}
              />
            ))}
          </div>
        )}
      </div>
    </>
  );
}

export default ContainersSection;
