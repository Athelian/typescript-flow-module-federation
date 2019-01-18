// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { ContainerCard } from 'components/Cards';
import { SectionNavBar } from 'components/NavBar';
import {
  ContainerSectionWrapperStyle,
  ContainerSectionBodyStyle,
  EmptyMessageStyle,
} from './style';

type Props = {
  container: ?Object,
};

function ContainerSection({ container }: Props) {
  return (
    <div className={ContainerSectionWrapperStyle}>
      <SectionNavBar>
        <div id="sortsandfilterswip" />
      </SectionNavBar>
      <div className={ContainerSectionBodyStyle}>
        {container ? (
          <ContainerCard container={container} />
        ) : (
          <div className={EmptyMessageStyle}>
            <FormattedMessage
              id="modules.Batches.noContainerFound"
              defaultMessage="No container found"
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default ContainerSection;
