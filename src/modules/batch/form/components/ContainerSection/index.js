// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { ContainerCard } from 'components/Cards';
import { SectionNavBar } from 'components/NavBar';
import { SectionHeader, SectionWrapper } from 'components/Form';
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
    <SectionWrapper id="batch_containerSection">
      <SectionHeader
        icon="CONTAINER"
        title={<FormattedMessage id="modules.Batches.container" defaultMessage="CONTAINER" />}
      />
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
    </SectionWrapper>
  );
}

export default ContainerSection;
