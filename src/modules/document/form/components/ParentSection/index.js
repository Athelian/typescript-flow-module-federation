// @flow
import * as React from 'react';
import { navigate } from '@reach/router';
import { FormattedMessage } from 'react-intl';
import { encodeId } from 'utils/id';
import {
  OrderCard,
  ItemCard,
  ShipmentCard,
  OrderProductProviderCard,
  MilestoneCard,
} from 'components/Cards';
import { SectionHeader, Display } from 'components/Form';
import DocumentFormContainer from 'modules/document/form/container';
import { spreadOrderItem } from 'utils/item';
import { SingleCardSection } from 'components/Sections';

const DocumentSection = () => {
  const { state } = DocumentFormContainer.useContainer();

  const renderParentCard = () => {
    switch (state.entity?.__typename) {
      case 'Order':
        return (
          <OrderCard
            order={state?.order}
            onClick={() => {
              // TODO: Handle permissions
              const canViewForm = true;

              if (canViewForm && !!state?.order?.id) {
                navigate(`/order/${encodeId(state?.order?.id)}`);
              }
            }}
          />
        );
      case 'OrderItem':
        return (
          <ItemCard
            {...spreadOrderItem(state?.orderItem)}
            onClick={() => {
              // TODO: Handle permissions
              const canViewForm = true;

              if (canViewForm && !!state?.orderItem?.id) {
                navigate(`/order-item/${encodeId(state?.orderItem?.id)}`);
              }
            }}
            viewable={{
              // TODO: Handle permissions
              price: true,
            }}
            navigable={{
              // TODO: Handle permissions
              product: true,
              order: true,
            }}
          />
        );
      case 'Shipment':
        return (
          <ShipmentCard
            shipment={state?.shipment}
            onClick={() => {
              // TODO: Handle permissions
              const canViewForm = true;

              if (canViewForm && !!state?.shipment?.id) {
                navigate(`/shipment/${encodeId(state?.shipment?.id)}`);
              }
            }}
          />
        );
      case 'ProductProvider':
        return (
          <OrderProductProviderCard
            productProvider={state?.productProvider}
            onClick={() => {
              // TODO: Handle permissions
              const canViewForm = true;

              if (canViewForm && !!state?.productProvider?.id) {
                navigate(`/product/${encodeId(state?.productProvider?.product?.id)}`);
              }
            }}
          />
        );
      case 'Milestone':
        return (
          <MilestoneCard
            milestone={state?.milestone}
            onClick={() => {
              // TODO: Handle permissions
              const canViewForm = true;

              if (canViewForm && !!state?.milestone?.id) {
                navigate(`/project/${encodeId(state?.milestone?.project?.id)}`);
              }
            }}
          />
        );
      default:
        return 'Oops';
    }
  };

  return (
    <>
      <SectionHeader
        icon="PARENT"
        title={<FormattedMessage id="modules.Documents.parentSection" defaultMessage="Parent" />}
      />

      <SingleCardSection>
        {state.entity ? (
          <>{renderParentCard()}</>
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
