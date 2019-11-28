// @flow
import * as React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { useMutation, useQuery } from '@apollo/react-hooks';
import { BaseButton } from 'components/Buttons';
import LoadingIcon from 'components/LoadingIcon';
import { OrderProductProviderCard } from 'components/Cards';
import Icon from 'components/Icon';
import FormattedNumber from 'components/FormattedNumber';
import GridColumn from 'components/GridColumn';
import { FieldItem, Display, Label } from 'components/Form';
import type { ActionComponentProps } from 'components/Sheet/SheetAction/types';
import SelectInput, { type RenderInputProps } from 'components/Inputs/SelectInput';
import { executeActionMutation, useSheetActionDialog } from 'components/Sheet/SheetAction';
import ActionDialog, { BatchLabelIcon, EndProductLabelIcon } from 'components/Dialog/ActionDialog';
import { DefaultOptionStyle } from 'components/Inputs/SelectInput/style';
import { removeTypename } from 'utils/data';
import messages from '../messages';
import { syncPackagingBatchActionMutation } from './mutation';
import { syncPackagingProductProviderQuery } from './query';
import {
  BodyWrapperStyle,
  ContentWrapperStyle,
  StarStyle,
  SelectInputStyle,
  SelectTextStyle,
  ArrowDownStyle,
} from './style';

type ContentProps = {
  productProvider: Object,
  selectedPackage: Object,
  setSelectedPackage: Object => void,
};

const BatchSyncPackagingContent = ({
  productProvider,
  selectedPackage,
  setSelectedPackage,
}: ContentProps) => {
  const intl = useIntl();

  return (
    <div className={ContentWrapperStyle}>
      <OrderProductProviderCard productProvider={productProvider} readOnly />

      <GridColumn gap="15px">
        <SelectInput
          value={selectedPackage}
          items={productProvider?.packages ?? []}
          itemToString={option => option?.name ?? ''}
          itemToValue={option => option}
          renderInput={({
            getToggleButtonProps,
            selectedItem,
            isOpen: selectDropdownIsOpen,
            itemToString,
          }: RenderInputProps) => (
            <button
              type="button"
              {...getToggleButtonProps()}
              className={SelectInputStyle(selectDropdownIsOpen)}
            >
              <span className={SelectTextStyle(!!selectedItem)}>
                {selectedItem?.name
                  ? itemToString(selectedItem)
                  : intl.formatMessage({
                      id: 'modules.ProductProviders.noPackageName',
                      defaultMessage: 'No package name',
                    })}
              </span>

              <i className={ArrowDownStyle(selectDropdownIsOpen)}>
                <Icon icon="CHEVRON_DOWN" />
              </i>
            </button>
          )}
          renderOption={({ item: option, highlighted, selected, itemToString }) => {
            const isDefault = option?.id === productProvider?.defaultPackage?.id;

            return (
              <div className={DefaultOptionStyle(highlighted, selected)}>
                <span className={StarStyle(isDefault)}>
                  <Icon icon="STAR" />
                </span>
                <span>
                  {option?.name
                    ? itemToString(option)
                    : intl.formatMessage({
                        id: 'modules.ProductProviders.noPackageName',
                        defaultMessage: 'No package name',
                      })}
                </span>
              </div>
            );
          }}
          onChange={option => {
            setSelectedPackage(option);
          }}
        />

        <FieldItem
          label={
            <Label>
              <FormattedMessage id="modules.ProductProviders.packageName" />
            </Label>
          }
          input={<Display>{selectedPackage?.name}</Display>}
        />

        <FieldItem
          label={
            <Label>
              <FormattedMessage id="modules.ProductProviders.packageCapacity" />
            </Label>
          }
          input={
            <Display>
              <FormattedNumber value={selectedPackage?.capacity} />
            </Display>
          }
        />

        <FieldItem
          label={
            <Label>
              <FormattedMessage id="modules.ProductProviders.grossWeight" />
            </Label>
          }
          input={
            <Display>
              <FormattedNumber value={selectedPackage?.grossWeight?.value} />
              {` ${selectedPackage?.grossWeight?.metric}`}
            </Display>
          }
        />

        <FieldItem
          label={
            <Label>
              <FormattedMessage id="modules.ProductProviders.pkgVolume" />
            </Label>
          }
          input={
            <Display>
              <FormattedNumber value={selectedPackage?.volume?.value} />
              {` ${selectedPackage?.volume?.metric}`}

              {selectedPackage?.autoCalculateVolume}
            </Display>
          }
        />

        <FieldItem
          label={
            <Label>
              <FormattedMessage id="modules.ProductProviders.pkgWidth" />
            </Label>
          }
          input={
            <Display>
              <FormattedNumber value={selectedPackage?.size?.width?.value} />
              {` ${selectedPackage?.size?.width?.metric}`}
            </Display>
          }
        />

        <FieldItem
          label={
            <Label>
              <FormattedMessage id="modules.ProductProviders.pkgHeight" />
            </Label>
          }
          input={
            <Display>
              <FormattedNumber value={selectedPackage?.size?.height?.value} />
              {` ${selectedPackage?.size?.height?.metric}`}
            </Display>
          }
        />

        <FieldItem
          label={
            <Label>
              <FormattedMessage id="modules.ProductProviders.pkgLength" />
            </Label>
          }
          input={
            <Display>
              <FormattedNumber value={selectedPackage?.size?.length?.value} />
              {` ${selectedPackage?.size?.length?.metric}`}
            </Display>
          }
        />
      </GridColumn>
    </div>
  );
};

type Props = {|
  getProductProviderId: (batchId: string, item: Object) => ?string,
|};

type ImplProps = {|
  ...ActionComponentProps,
  ...Props,
|};

const BatchSyncPackagingActionImpl = ({
  entity,
  item,
  onDone,
  getProductProviderId,
}: ImplProps) => {
  const [isOpen, close] = useSheetActionDialog(onDone);
  const [updateBatch, { loading: processing, called }] = useMutation(
    syncPackagingBatchActionMutation
  );

  const [selectedPackage, setSelectedPackage] = React.useState(null);

  const productProviderId = getProductProviderId(entity.id, item);
  const { data, loading } = useQuery(syncPackagingProductProviderQuery, {
    variables: { id: productProviderId },
    fetchPolicy: 'network-only',
    onCompleted: result => {
      setSelectedPackage(removeTypename(result?.productProvider?.defaultPackage));
    },
  });
  const productProvider = removeTypename(data?.productProvider ?? null);

  const onSync = () => {
    executeActionMutation(
      updateBatch,
      {
        id: entity.id,
        input: {
          packageName: selectedPackage?.name,
          packageCapacity: selectedPackage?.capacity,
          packageGrossWeight: selectedPackage?.grossWeight,
          packageVolume: selectedPackage?.volume,
          autoCalculatePackageVolume: selectedPackage?.autoCalculateVolume,
          packageSize: selectedPackage?.size,
        },
      },
      close
    );
  };

  let dialogMessage = null;

  if (processing || called) {
    dialogMessage = (
      <FormattedMessage
        {...messages.batchSyncPackagingSyncing}
        values={{ batchLabel: <BatchLabelIcon /> }}
      />
    );
  } else {
    dialogMessage = (
      <FormattedMessage
        {...messages.batchSyncPackagingMessage}
        values={{ endProductLabel: <EndProductLabelIcon />, batchLabel: <BatchLabelIcon /> }}
      />
    );
  }

  return (
    <ActionDialog
      isOpen={isOpen}
      isProcessing={processing || called}
      onCancel={close}
      title={<FormattedMessage {...messages.batchSyncPackagingTitle} />}
      dialogMessage={dialogMessage}
      buttons={
        <BaseButton
          label={<FormattedMessage {...messages.batchSyncPackagingSyncButton} />}
          icon="SYNC"
          disabled={loading}
          onClick={onSync}
        />
      }
    >
      <div className={BodyWrapperStyle}>
        {loading ? (
          <LoadingIcon />
        ) : (
          <BatchSyncPackagingContent
            productProvider={productProvider}
            selectedPackage={selectedPackage}
            setSelectedPackage={setSelectedPackage}
          />
        )}
      </div>
    </ActionDialog>
  );
};

const BatchSyncPackagingAction = ({ getProductProviderId }: Props) => (
  props: ActionComponentProps
) => <BatchSyncPackagingActionImpl {...props} getProductProviderId={getProductProviderId} />;

export default BatchSyncPackagingAction;
