// @flow
import * as React from 'react';
import { BooleanValue } from 'react-values';
import { navigate } from '@reach/router';
import { FormattedMessage } from 'react-intl';
import { useMutation } from '@apollo/react-hooks';
import GridView from 'components/GridView';
import ActionDialog from 'components/Dialog/ActionDialog';
import { BaseButton } from 'components/Buttons';
import { ProductCard, CardAction } from 'components/Cards';
import { ProductActivateDialog, ProductArchiveDialog } from 'modules/product/common/Dialog';
import {
  PRODUCT_CREATE,
  PRODUCT_UPDATE,
  PRODUCT_DELETE,
  PRODUCT_SET_ARCHIVED,
  PRODUCT_FORM,
} from 'modules/permission/constants/product';
import { encodeId } from 'utils/id';
import emitter from 'utils/emitter';
import PartnerPermissionsWrapper from 'components/PartnerPermissionsWrapper';
import { deleteProductMutation } from '../mutation';

type Props = {
  items: Array<Object>,
  onLoadMore: Function,
  hasMore: boolean,
  isLoading: boolean,
};

function onClone(productId: string) {
  navigate(`/product/clone/${encodeId(productId)}`);
}

const ProductGridView = (props: Props) => {
  const { items, onLoadMore, hasMore, isLoading } = props;

  const [deleteMutate, { loading: isProcessing }] = useMutation(deleteProductMutation);

  return (
    <GridView
      onLoadMore={onLoadMore}
      hasMore={hasMore}
      isLoading={isLoading}
      itemWidth="195px"
      isEmpty={items.length === 0}
      emptyMessage={
        <FormattedMessage id="modules.Products.noProductFound" defaultMessage="No products found" />
      }
    >
      {items.map(item => (
        <BooleanValue key={item.id}>
          {({ value: deleteDialogIsOpen, set: deleteDialogToggle }) => (
            <BooleanValue key={item.id}>
              {({ value: statusDialogIsOpen, set: statusDialogToggle }) => (
                <>
                  {item.archived ? (
                    <ProductActivateDialog
                      onRequestClose={() => statusDialogToggle(false)}
                      isOpen={statusDialogIsOpen}
                      product={item}
                    />
                  ) : (
                    <ProductArchiveDialog
                      onRequestClose={() => statusDialogToggle(false)}
                      isOpen={statusDialogIsOpen}
                      product={item}
                    />
                  )}

                  <ActionDialog
                    isOpen={deleteDialogIsOpen}
                    isProcessing={isProcessing}
                    onCancel={() => deleteDialogToggle(false)}
                    title={
                      <FormattedMessage
                        id="modules.Products.dialog.delete.title"
                        defaultMessage="Delete Product"
                      />
                    }
                    dialogMessage={
                      <FormattedMessage
                        id="modules.Products.dialog.delete.message"
                        defaultMessage="Are you sure you want to delete this Batch?"
                      />
                    }
                    buttons={[
                      <BaseButton
                        key="btn-delete"
                        label={
                          <FormattedMessage
                            id="components.DocumentsDeleteDialog.delete"
                            defaultMessage="DELETE"
                          />
                        }
                        onClick={async () => {
                          await deleteMutate({
                            variables: { id: item.id },
                          });
                          emitter.emit('CHANGE_PRODUCT_STATUS');
                          deleteDialogToggle(false);
                        }}
                      />,
                    ]}
                  />

                  <PartnerPermissionsWrapper data={item}>
                    {permissions => (
                      <ProductCard
                        product={item}
                        actions={[
                          ...(permissions.includes(PRODUCT_CREATE)
                            ? [<CardAction icon="CLONE" onClick={() => onClone(item.id)} />]
                            : []),
                          ...(permissions.includes(PRODUCT_UPDATE) ||
                          permissions.includes(PRODUCT_SET_ARCHIVED)
                            ? [
                                <CardAction
                                  icon={item.archived ? 'ACTIVE' : 'ARCHIVE'}
                                  onClick={() => statusDialogToggle(true)}
                                />,
                              ]
                            : []),
                          ...(permissions.includes(PRODUCT_DELETE) &&
                          item.productProviders.filter(p => p.referenced).length === 0
                            ? [
                                <CardAction
                                  icon="REMOVE"
                                  onClick={() => deleteDialogToggle(true)}
                                />,
                              ]
                            : []),
                        ]}
                        showActionsOnHover
                        onClick={() => {
                          if (permissions.includes(PRODUCT_FORM)) {
                            navigate(`/product/${encodeId(item.id)}`);
                          }
                        }}
                      />
                    )}
                  </PartnerPermissionsWrapper>
                </>
              )}
            </BooleanValue>
          )}
        </BooleanValue>
      ))}
    </GridView>
  );
};

export default ProductGridView;
