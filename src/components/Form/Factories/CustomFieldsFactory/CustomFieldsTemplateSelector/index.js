// @flow
import * as React from 'react';
import { countMaskFieldDefinitions } from 'utils/customFields';
import useQueryList from 'hooks/useQueryList';
import { TemplateCard } from 'components/Cards';
import { Content, SlideViewLayout, SlideViewNavBar } from 'components/Layout';
import { EntityIcon } from 'components/NavBar';
import { SaveButton, CancelButton } from 'components/Buttons';
import Selector from 'components/Selector';
import MaskGridView from 'modules/metadata/components/MaskGridView';
import { masksQuery } from 'modules/metadata/query';

type Props = {
  entityType: string,
  onCancel: Function,
  onSave: Function,
  saveButtonId?: string,
  selected: ?{
    id: string,
    name: string,
  },
};

const defaultProps = {
  selected: {
    id: '',
    name: '',
  },
};

const CustomFieldsTemplateSelector = ({
  entityType,
  selected,
  onCancel,
  onSave,
  saveButtonId,
}: Props) => {
  const { nodes, loading, hasMore, loadMore } = useQueryList(
    masksQuery,
    {
      variables: {
        page: 1,
        perPage: 10,
        filterBy: { entityTypes: [entityType] },
      },
      fetchPolicy: 'network-only',
    },
    'masks'
  );

  return (
    <Selector.Single selected={selected}>
      {({ value, dirty, getItemProps }) => (
        <SlideViewLayout>
          <SlideViewNavBar>
            <EntityIcon icon="TEMPLATE" color="TEMPLATE" invert />
            <CancelButton onClick={onCancel} />
            <SaveButton
              id={saveButtonId}
              data-testid="saveButtonOnSelectMask"
              disabled={!dirty}
              onClick={() => onSave(value)}
            />
          </SlideViewNavBar>

          <Content>
            <MaskGridView
              entityType={entityType}
              items={nodes}
              onLoadMore={loadMore}
              hasMore={hasMore}
              isLoading={loading}
              renderItem={mask => (
                <TemplateCard
                  key={mask.id}
                  template={{
                    id: mask.id,
                    title: mask.name,
                    description: mask.memo,
                    count: countMaskFieldDefinitions(mask),
                  }}
                  type="METADATA"
                  {...getItemProps(mask)}
                />
              )}
            />
          </Content>
        </SlideViewLayout>
      )}
    </Selector.Single>
  );
};

CustomFieldsTemplateSelector.defaultProps = defaultProps;

export default CustomFieldsTemplateSelector;
