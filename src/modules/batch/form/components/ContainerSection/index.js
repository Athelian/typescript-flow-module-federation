// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import usePermission from 'hooks/usePermission';
import usePartnerPermission from 'hooks/usePartnerPermission';
import { WAREHOUSE_FORM } from 'modules/permission/constants/warehouse';
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
  const { isOwner } = usePartnerPermission();
  const { hasPermission } = usePermission(isOwner);
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
            <ContainerCard
              container={container}
              permission={{
                viewWarehouse: hasPermission([WAREHOUSE_FORM]),
              }}
            />
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
