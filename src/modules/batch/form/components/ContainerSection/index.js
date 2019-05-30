// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { navigate } from '@reach/router';
import { encodeId } from 'utils/id';
import usePermission from 'hooks/usePermission';
import usePartnerPermission from 'hooks/usePartnerPermission';
import { WAREHOUSE_FORM } from 'modules/permission/constants/warehouse';
import { ContainerCard } from 'components/Cards';
import { SectionNavBar } from 'components/NavBar';
import { SectionHeader, SectionWrapper } from 'components/Form';
import { HIDE, NAVIGABLE, READONLY } from 'modules/batch/constants';
import type { ContainerConfigType } from 'modules/batch/type';
import {
  ContainerSectionWrapperStyle,
  ContainerSectionBodyStyle,
  EmptyMessageStyle,
} from './style';

type Props = {
  container: ?Object,
  containerConfig: ContainerConfigType,
};

function ContainerSection({ container, containerConfig }: Props) {
  const { isOwner } = usePartnerPermission();
  const { hasPermission } = usePermission(isOwner);

  if (containerConfig === HIDE) {
    return null;
  }

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
              readOnly={containerConfig === READONLY}
              onClick={() => {
                if (containerConfig === NAVIGABLE) {
                  navigate(`/container/${encodeId(container.id)}`);
                }
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
