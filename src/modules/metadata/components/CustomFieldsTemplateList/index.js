// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { Query } from 'react-apollo';
import { BooleanValue } from 'react-values';
import { getByPathWithDefault } from 'utils/fp';
import loadMore from 'utils/loadMore';
import SlideView from 'components/SlideView';
import { NewButton } from 'components/Buttons';
import FormHeader from 'modules/metadata/components/FormHeader';
import CustomFieldsTemplateGridView from 'modules/metadata/components/CustomFieldsTemplateGridView';
import CustomFieldsTemplateForm from 'modules/metadata/components/CustomFieldsTemplateForm';
import { masksQuery } from 'modules/metadata/query';

import { CustomFieldsEditFormWrapperStyle, CustomFieldsFormHeaderStyle } from './style';

type Props = {
  entityType: string,
};

const CustomFieldTemplateList = ({ entityType }: Props) => (
  <Query
    query={masksQuery}
    variables={{
      page: 1,
      perPage: 10,
      filterBy: entityType,
    }}
    fetchPolicy="network-only"
  >
    {({ loading, data, fetchMore, error }) => {
      if (error) {
        return error.message;
      }

      const nextPage = getByPathWithDefault(1, 'masks.page', data) + 1;
      const totalPage = getByPathWithDefault(1, 'masks.totalPage', data);
      const hasMore = nextPage <= totalPage;

      return (
        <div>
          <BooleanValue>
            {({ value: isOpen, set: toggle }) => (
              <>
                <div className={CustomFieldsFormHeaderStyle}>
                  <FormHeader
                    name={
                      <FormattedMessage
                        id="modules.metadata.templates"
                        defaultMessage="TEMPLATES"
                      />
                    }
                  >
                    <NewButton onClick={() => toggle(true)} />
                  </FormHeader>
                </div>
                <div className={CustomFieldsEditFormWrapperStyle}>
                  <CustomFieldsTemplateGridView
                    items={getByPathWithDefault([], 'masks.nodes', data)}
                    onLoadMore={() =>
                      loadMore({ fetchMore, data }, { filterBy: entityType }, 'masks')
                    }
                    hasMore={hasMore}
                    isLoading={loading}
                  />
                </div>
                <SlideView
                  isOpen={isOpen}
                  onRequestClose={() => toggle(false)}
                  options={{ width: '1030px' }}
                >
                  <CustomFieldsTemplateForm
                    isNew
                    onSave={() => toggle(false)}
                    onCancel={() => toggle(false)}
                  />
                </SlideView>
              </>
            )}
          </BooleanValue>
        </div>
      );
    }}
  </Query>
);

export default CustomFieldTemplateList;
