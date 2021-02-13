// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { toLowerFirst } from 'utils/string';
import { getByPathWithDefault } from 'utils/fp';
import { SectionHeader, Display, Blackout } from 'components/Form';
import DocumentFormContainer from 'modules/document/form/container';
import { SingleCardSection } from 'components/Sections';
import SlideView from 'components/SlideView';
import useFilter from 'hooks/useFilter';
import { BaseButton } from 'components/Buttons';
import { SlideViewLayout, SlideViewNavBar } from 'components/Layout';
import { EntityIcon } from 'components/NavBar';
import {
  ParentOrderCard,
  ParentItemCard,
  ParentShipmentCard,
  ParentEndProductCard,
  ParentMilestoneCard,
  ParentNavbarTabs,
  ParentDocumentDialog,
  ParentSelectList,
} from './components';

const initFilter = {
  filter: {
    entityTypes: ['Order'],
  },
  sort: {
    field: 'updatedAt',
    direction: 'DESCENDING',
  },
  perPage: 10,
  page: 1,
};

const ParentSection = () => {
  const { state, setFieldValues } = DocumentFormContainer.useContainer();

  const [isParentSelectionOpen, setIsParentSelectionOpen] = React.useState(false);
  const [isDialogOpen, setDialogOpen] = React.useState(false);
  const [newParent, setNewParent] = React.useState(null);

  const { filterAndSort, onChangeFilter } = useFilter(initFilter, `filterParentDocumentType`);

  const activeType = getByPathWithDefault('Order', 'filter.entityTypes.0', filterAndSort);

  const mapping = {
    Order: <ParentOrderCard order={state?.order} />,
    OrderItem: <ParentItemCard orderItem={state?.orderItem} />,
    Shipment: <ParentShipmentCard shipment={state?.shipment} />,
    ProductProvider: <ParentEndProductCard productProvider={state?.productProvider} />,
    Milestone: <ParentMilestoneCard milestone={state?.milestone} />,
  };

  const onParentSelected = (parent: Object) => {
    setNewParent(parent);
    setDialogOpen(true);
  };

  const onDialogSave = (updatedFiles: [Object]) => {
    if (!newParent) {
      return;
    }

    const newType = {
      id: newParent.id,
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
        ...newParent,
        files: updatedFiles,
      },
    };

    setFieldValues(newTypes);

    setIsParentSelectionOpen(false);
    setDialogOpen(false);
  };

  return (
    <>
      <SectionHeader
        icon="PARENT"
        title={<FormattedMessage id="modules.Documents.parentSection" defaultMessage="Parent" />}
      />

      <SingleCardSection
        navbarContent={
          <BaseButton
            label={
              <FormattedMessage id="modules.Documents.setParent" defaultMessage="Set Parent" />
            }
            onClick={() => setIsParentSelectionOpen(true)}
            backgroundColor="TEAL"
            hoverBackgroundColor="TEAL_DARK"
          />
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
      <SlideView
        isOpen={isParentSelectionOpen}
        onRequestClose={() => setIsParentSelectionOpen(false)}
      >
        <SlideViewLayout>
          <SlideViewNavBar>
            <EntityIcon icon="DOCUMENT" color="DOCUMENT" subIcon="CARDS" />
            <ParentNavbarTabs
              filterAndSort={filterAndSort}
              onChangeFilter={onChangeFilter}
              activeType={activeType}
            />
          </SlideViewNavBar>
          {isParentSelectionOpen && (
            <ParentSelectList
              onSelect={onParentSelected}
              onCancel={() => setIsParentSelectionOpen(false)}
              type={activeType}
            />
          )}
          <ParentDocumentDialog
            files={state}
            isDialogOpen={isDialogOpen}
            onRequestClose={() => setDialogOpen(false)}
            onCancel={() => setDialogOpen(false)}
            entity={activeType}
            onSave={onDialogSave}
          />
        </SlideViewLayout>
      </SlideView>
    </>
  );
};

export default ParentSection;
