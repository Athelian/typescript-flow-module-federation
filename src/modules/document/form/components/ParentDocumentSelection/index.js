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
import { formatFilesToArray } from 'utils/file';
import type { File } from 'generated/graphql';

import { ParentNavbarLabelStyle } from '../../style';
import { ParentDocumentTypeDialog, ParentNavbarTabs, ParentSelectList } from './components';

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
  files: File | File[],
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
  const [selectedParent, setSelectedParent] = React.useState(null);

  const [isDialogOpen, setDialogOpen] = React.useState(false);

  const [updateParentMutation, { loading: isParentUpdating }] = useDocumentParentMutation();

  const { filterAndSort, onChangeFilter } = useFilter(initFilter, `filterParentDocumentType`);

  const activeType = getByPathWithDefault('Order', 'filter.entityTypes.0', filterAndSort);

  const onDialogSave = async (newFiles: File[], newParent?: Object) => {
    const parentParam = selectedParent || newParent;

    if (mutateOnDialogSave && parentParam) {
      const newEntity = {
        entity: {
          id: parentParam.id,
          __typename: activeType,
        },
        [toLowerFirst(activeType)]: {
          ...parentParam,
          files: newFiles,
        },
      };

      await updateParentMutation({
        type: activeType,
        newState: newEntity,
      });
    }

    onSelectDone({
      parent: parentParam,
      files: newFiles,
      activeType,
    });

    // resets the selected
    setSelectedParent(null);

    setDialogOpen(false);
  };

  const onParentSelected = (parent: Object) => {
    if (activeType === 'OrderItem' || activeType === 'Milestone') {
      // since OrderItem and Milestone only have one type 'Miscellaneous'
      // so we set to Document
      const updatedFiles = formatFilesToArray(files).map(file => ({ ...file, type: 'Document' }));
      onDialogSave(updatedFiles, parent);
      return;
    }

    setSelectedParent(parent);
    setDialogOpen(true);
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
            isLoading={isParentUpdating}
            onSelect={onParentSelected}
            onCancel={onRequestClose}
            type={activeType}
          />
        )}
        {isDialogOpen && (
          <ParentDocumentTypeDialog
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
