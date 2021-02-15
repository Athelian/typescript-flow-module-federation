// @flow
import * as React from 'react';
import { getByPathWithDefault } from 'utils/fp';
import SlideView from 'components/SlideView';
import useFilter from 'hooks/useFilter';
import { SlideViewLayout, SlideViewNavBar } from 'components/Layout';
import { EntityIcon } from 'components/NavBar';
import { ParentNavbarTabs, ParentDocumentDialog, ParentSelectList } from './components';

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

type Props = {
  isParentSelectionOpen: boolean,
  files: Object[],
  onRequestClose: Function,
  onSelectDone: Function,
};

const ParentDocumentSelection = ({
  isParentSelectionOpen,
  onRequestClose,
  onSelectDone,
  files,
}: Props) => {
  const [selected, setSelected] = React.useState({
    parent: null,
    files: [],
    activeType: 'Order',
  });

  const [isDialogOpen, setDialogOpen] = React.useState(false);

  const { filterAndSort, onChangeFilter } = useFilter(initFilter, `filterParentDocumentType`);

  const activeType = getByPathWithDefault('Order', 'filter.entityTypes.0', filterAndSort);

  const onParentSelected = (parent: Object) => {
    console.log('parent is selected ', parent);

    setSelected(_selected => {
      return {
        ..._selected,
        parent,
      };
    });

    setDialogOpen(true);
  };

  const onDialogSave = (newFiles: [Object]) => {
    setDialogOpen(false);
    onSelectDone({
      ...selected,
      files: newFiles,
      activeType,
    });

    setSelected({
      parentId: null,
      files: [],
      activeType: 'Order',
    });
  };

  return (
    <SlideView isOpen={isParentSelectionOpen} onRequestClose={onRequestClose}>
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
            onCancel={onRequestClose}
            type={activeType}
          />
        )}
        <ParentDocumentDialog
          files={files}
          isDialogOpen={isDialogOpen}
          onRequestClose={() => setDialogOpen(false)}
          onCancel={() => setDialogOpen(false)}
          entity={activeType}
          onSave={onDialogSave}
        />
      </SlideViewLayout>
    </SlideView>
  );
};

export default ParentDocumentSelection;
