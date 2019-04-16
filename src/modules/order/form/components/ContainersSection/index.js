// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { ContainerCard } from 'components/Cards';
import { SectionNavBar } from 'components/NavBar';
import {
  ContainersSectionWrapperStyle,
  ContainersSectionBodyStyle,
  EmptyMessageStyle,
} from './style';

type Props = {
  containers: Array<Object>,
};

function ContainersSection({ containers }: Props) {
  return (
    <div className={ContainersSectionWrapperStyle}>
      <SectionNavBar>
        <div id="sortsandfilterswip" />
      </SectionNavBar>
      <div className={ContainersSectionBodyStyle}>
        {containers.length === 0 ? (
          <div className={EmptyMessageStyle}>
            <FormattedMessage
              id="modules.Orders.noContainersFound"
              defaultMessage="No containers found"
            />
          </div>
        ) : (
          containers.map(container => <ContainerCard container={container} key={container.id} />)
        )}
      </div>
    </div>
  );
}

export default ContainersSection;
