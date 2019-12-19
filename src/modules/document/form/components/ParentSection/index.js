// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { SectionHeader, Display } from 'components/Form';
import DocumentFormContainer from 'modules/document/form/container';
import { SingleCardSection } from 'components/Sections';
import {
  ParentOrderCard,
  ParentItemCard,
  ParentShipmentCard,
  ParentEndProductCard,
  ParentMilestoneCard,
} from './components';

const DocumentSection = () => {
  const { state } = DocumentFormContainer.useContainer();

  const mapping = {
    Order: <ParentOrderCard order={state?.order} />,
    OrderItem: <ParentItemCard orderItem={state?.orderItem} />,
    Shipment: <ParentShipmentCard shipment={state?.shipment} />,
    ProductProvider: <ParentEndProductCard productProvider={state?.productProvider} />,
    Milestone: <ParentMilestoneCard milestone={state?.milestone} />,
  };

  return (
    <>
      <SectionHeader
        icon="PARENT"
        title={<FormattedMessage id="modules.Documents.parentSection" defaultMessage="Parent" />}
      />

      <SingleCardSection>
        {state.entity ? (
          mapping[state.entity?.__typename]
        ) : (
          <Display align="center">
            <FormattedMessage
              id="modules.Documents.noParentMessage"
              defaultMessage="This file does not belong to any parent. You can add this file to a parent in the parent's form"
            />
          </Display>
        )}
      </SingleCardSection>
    </>
  );
};
export default DocumentSection;
