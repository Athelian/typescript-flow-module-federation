// @flow
import * as React from 'react';
import { ObjectValue } from 'react-values';
import { cleanUpData } from 'utils/data';
import { getByPath } from 'utils/fp';
import PartnerListProvider from 'providers/PartnerList';
import Layout from 'components/Layout';
import ConfirmDialog from 'components/Dialog/ConfirmDialog';
import { SlideViewNavBar, EntityIcon } from 'components/NavBar';
import { SaveButton, CancelButton } from 'components/Buttons';
import { PartnerCard } from 'components/Cards';
import PartnerGridView from 'modules/partner/list/PartnerGridView';

type OptionalProps = {
  isRequired: boolean,
  selected: {
    id: string,
    name: string,
  },
};

type Props = OptionalProps & {
  warningMessage: React.Node,
  onSelect: (item: Object) => void,
  onCancel: Function,
};

const defaultProps = {
  isRequired: false,
};

const isEquals = (value: ?Object, selected: ?Object): boolean => {
  const { id: newId } = value || {};
  const { id: oldId } = selected || {};
  return newId === oldId;
};

const SelectExporter = ({ isRequired, selected, onCancel, onSelect, warningMessage }: Props) => {
  const [openConfirmDialog, setOpenConfirmDialog] = React.useState(false);

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
                      if (getByPath('id', selected) !== getByPath('id', value)) {
                        setOpenConfirmDialog(true);
                      } else {
                        onSelect(value);
                        setOpenConfirmDialog(false);
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
                    message={warningMessage}
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
                    key={item.id}
                    data-testid="partnerCard"
                    partner={item}
                    onSelect={() => {
                      if (!isRequired && (value && value.id === item.id)) {
                        set(null);
                      } else {
                        set(cleanUpData(item));
                      }
                    }}
                    selectable
                    selected={value && value.id === item.id}
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
