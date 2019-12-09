// @flow
import * as React from 'react';
import { useQuery } from '@apollo/react-hooks';
import SlideView from 'components/SlideView';
import LoadingIcon from 'components/LoadingIcon';
import TableTemplateFormWrapper from 'modules/tableTemplate/common/TableTemplateFormWrapper';
import TableTemplateFormContainer from 'modules/tableTemplate/form/container';
import { allCustomFieldDefinitionsQuery } from 'modules/tableTemplate/list/query';
import type { ColumnConfig } from '../../SheetState/types';

type RenderProps = {
  onClick: () => void,
};

type Props = {
  columns: Array<ColumnConfig>,
  templateType: string,
  onSave: Object => void,
  children: RenderProps => React.Node,
};

const TemplateNew = ({ columns, templateType, onSave, children }: Props) => {
  const [open, setOpen] = React.useState(false);

  const {
    data: customFields,
    loading: customFieldsQueryIsLoading,
  } = useQuery(allCustomFieldDefinitionsQuery, { fetchPolicy: 'network-only' });

  return (
    <>
      {children({ onClick: () => setOpen(true) })}

      <SlideView
        isOpen={open}
        onRequestClose={() => setOpen(false)}
        shouldConfirm={() => document.getElementById('table_template_form_save_button')}
      >
        {customFieldsQueryIsLoading ? (
          <LoadingIcon />
        ) : (
          <TableTemplateFormContainer.Provider
            initialState={{
              type: templateType,
              columns: columns.map(({ key, hidden }) => ({ key, hidden })),
              customFields,
            }}
          >
            <TableTemplateFormWrapper
              isNew
              onSave={template => {
                onSave(template);
                setOpen(false);
              }}
              onCancel={() => setOpen(false)}
            />
          </TableTemplateFormContainer.Provider>
        )}
      </SlideView>
    </>
  );
};

export default TemplateNew;
