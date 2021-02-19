// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import usePartnerPermission from 'hooks/usePartnerPermission';
import usePermission from 'hooks/usePermission';
import { toLowerFirst } from 'utils/string';
import { SectionHeader, Display, Blackout } from 'components/Form';
import DocumentFormContainer from 'modules/document/form/container';
import { SingleCardSection } from 'components/Sections';
import { BaseButton } from 'components/Buttons';
import { DOCUMENT_SET_ENTITY, DOCUMENT_UPDATE } from 'modules/permission/constants/file';
import {
  ParentOrderCard,
  ParentItemCard,
  ParentShipmentCard,
  ParentEndProductCard,
  ParentMilestoneCard,
} from './components';
import ParentDocumentSelection from '../ParentDocumentSelection';

const ParentSection = () => {
  const { isOwner } = usePartnerPermission();
  const { hasPermission } = usePermission(isOwner);
  const canSetParent = hasPermission([DOCUMENT_SET_ENTITY, DOCUMENT_UPDATE]);

  const { state, setFieldValues } = DocumentFormContainer.useContainer();

  const [isParentSelectionOpen, setParentSelectionOpen] = React.useState(false);

  const mapping = {
    Order: <ParentOrderCard order={state?.order} />,
    OrderItem: <ParentItemCard orderItem={state?.orderItem} />,
    Shipment: <ParentShipmentCard shipment={state?.shipment} />,
    ProductProvider: <ParentEndProductCard productProvider={state?.productProvider} />,
    Milestone: <ParentMilestoneCard milestone={state?.milestone} />,
  };

  const onSelectDone = (props: { parent: Object, files: [Object], activeType: string }) => {
    const { parent, files, activeType } = props;

    if (!parent || !parent.id) {
      return;
    }

    const newType = {
      id: parent.id,
      __typename: activeType,
    };

    const activePropertyType = toLowerFirst(activeType);

    const newTypes = {
      entity: newType,
      milestone: newType,
      order: newType,
      orderItem: newType,
      productProvider: newType,
      shipment: newType,
      [activePropertyType]: {
        ...parent,
        files,
      },
    };

    setFieldValues(newTypes);
    setParentSelectionOpen(false);
  };

  return (
    <>
      <SectionHeader
        icon="PARENT"
        title={<FormattedMessage id="modules.Documents.parentSection" defaultMessage="Parent" />}
      />

      <SingleCardSection
        navbarContent={
          canSetParent && (
            <BaseButton
              label={
                <FormattedMessage id="modules.Documents.setParent" defaultMessage="Set Parent" />
              }
              onClick={() => setParentSelectionOpen(true)}
              backgroundColor="TEAL"
              hoverBackgroundColor="TEAL_DARK"
            />
          )
        }
      >
        {state.entity ? (
          mapping[state.entity?.__typename] || <Blackout width="195px" height="230px" />
        ) : (
          <Display align="center">
            <FormattedMessage
              id="modules.Documents.noParentMessage"
              defaultMessage="This file does not belong to any parent. You can add this file to a parent in the parent's form"
            />
          </Display>
        )}
      </SingleCardSection>

      <ParentDocumentSelection
        isParentSelectionOpen={isParentSelectionOpen}
        onSelectDone={onSelectDone}
        files={state}
        onRequestClose={() => setParentSelectionOpen(false)}
      />
    </>
  );
};

export default ParentSection;
