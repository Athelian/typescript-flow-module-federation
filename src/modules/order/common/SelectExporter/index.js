// @flow
import React, { useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { ObjectValue } from 'react-values';
import { cleanUpData } from 'utils/data';
import PartnerListProvider from 'providers/PartnerList';
import Layout from 'components/Layout';
import { SlideViewNavBar, EntityIcon } from 'components/NavBar';
import { SaveButton, CancelButton } from 'components/Buttons';
import PartnerGridView from 'modules/partner/list/PartnerGridView';
import { PartnerCard } from 'components/Cards';
import ConfirmDialog from 'components/Dialog/ConfirmDialog';

type Props = {
  selected?: ?{
    id: string,
    name: string,
  },
  onSelect: (item: Object) => void,
  onCancel: Function,
};

const defaultProps = {
  selected: {
    id: '',
    name: '',
  },
};

const isEquals = (value: ?Object, selected: ?Object): boolean => {
  const { id: newId } = value || {};
  const { id: oldId } = selected || {};
  return newId === oldId;
};

const SelectExporter = ({ selected, onCancel, onSelect }: Props) => {
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);

  return (
    <PartnerListProvider types={['Exporter']}>
      {({ loading, data }) => (
        <ObjectValue defaultValue={selected}>
          {({ value, set }) => (
            <Layout
              navBar={
                <SlideViewNavBar>
                  <EntityIcon icon="PARTNER" color="PARTNER" />
                  <CancelButton onClick={onCancel} />
                  <SaveButton
                    data-testid="btnSaveExporter"
                    disabled={isEquals(value, selected)}
                    onClick={() => {
                      if (!selected || selected.id !== value.id) {
                        setOpenConfirmDialog(true);
                      }
                    }}
                  />
                  <ConfirmDialog
                    isOpen={openConfirmDialog}
                    onRequestClose={() => setOpenConfirmDialog(false)}
                    onCancel={() => setOpenConfirmDialog(false)}
                    onConfirm={() => {
                      onSelect(value);
                      setOpenConfirmDialog(false);
                    }}
                    message={
                      <FormattedMessage
                        id="modules.order.changeExporterWarning"
                        defaultMessage="Changing the Exporter will remove all assigned Staff of the current Exporter from all Tasks. Are you sure you want to change the Exporter?"
                      />
                    }
                  />
                </SlideViewNavBar>
              }
            >
              <PartnerGridView
                hasMore={false}
                isLoading={loading}
                onLoadMore={() => {}}
                items={data.filter(partner => partner.types.includes('Exporter'))}
                renderItem={item => (
                  <PartnerCard
                    data-testid="partnerCard"
                    partner={item}
                    onSelect={() => set(cleanUpData(item))}
                    selectable
                    selected={value && item.id === value.id}
                    key={item.id}
                  />
                )}
              />
            </Layout>
          )}
        </ObjectValue>
      )}
    </PartnerListProvider>
  );
};

SelectExporter.defaultProps = defaultProps;

export default SelectExporter;
