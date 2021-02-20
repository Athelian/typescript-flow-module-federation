// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { getByPathWithDefault } from 'utils/fp';
import SlideView from 'components/SlideView';
import useFilter from 'hooks/useFilter';
import useDocumentParentMutation from 'modules/document/hooks/useDocumentParentMutation';
import { SlideViewLayout, SlideViewNavBar } from 'components/Layout';
import { Label } from 'components/Form';
import { toLowerFirst } from 'utils/string';

import { ParentNavbarLabelStyle } from '../../style';
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
  files: any,
  mutateOnDialogSave?: boolean,
  onRequestClose: Function,
  onSelectDone: Function,
};

const ParentDocumentSelection = ({
  isParentSelectionOpen,
  mutateOnDialogSave = false,
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

  const [updateParent, { loading: isParentUpdating }] = useDocumentParentMutation();

  const { filterAndSort, onChangeFilter } = useFilter(initFilter, `filterParentDocumentType`);

  const activeType = getByPathWithDefault('Order', 'filter.entityTypes.0', filterAndSort);

  const onParentSelected = (parent: Object) => {
    setSelected(_selected => {
      return {
        ..._selected,
        parent,
      };
    });

    setDialogOpen(true);
  };

  const onDialogSave = async (newFiles: [Object]) => {
    if (mutateOnDialogSave && selected.parent) {
      const newEntity = {
        entity: {
          id: selected.parent.id,
          __typename: activeType,
        },
        [toLowerFirst(activeType)]: {
          ...selected.parent,
          files: newFiles,
        },
      };

      await updateParent({
        type: activeType,
        newState: newEntity,
      });
    }

    onSelectDone({
      ...selected,
      files: newFiles,
      activeType,
    });

    // resets the selected
    setSelected({
      parentId: null,
      files: [],
    });

    setDialogOpen(false);
  };

  return (
    <SlideView shouldConfirm={false} isOpen={isParentSelectionOpen} onRequestClose={onRequestClose}>
      <SlideViewLayout>
        <SlideViewNavBar>
          <Label className={ParentNavbarLabelStyle}>
            <FormattedMessage
              id="modules.documents.navbar.label"
              defaultMessage="SELECT DOCUMENT TYPE"
            />
          </Label>
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
        {isDialogOpen && (
          <ParentDocumentDialog
            files={files}
            isLoading={isParentUpdating}
            isDialogOpen={isDialogOpen}
            onRequestClose={() => setDialogOpen(false)}
            onCancel={() => setDialogOpen(false)}
            entity={activeType}
            onSave={onDialogSave}
          />
        )}
      </SlideViewLayout>
    </SlideView>
  );
};

export default ParentDocumentSelection;
