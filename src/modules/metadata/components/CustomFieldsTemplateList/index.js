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
import MaskFormWrapper from 'modules/metadata/components/MaskFormWrapper';
import { masksQuery } from 'modules/metadata/query';
import MetadataTemplateCard from 'components/Cards/MetadataTemplateCard';

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
      filter: { entityTypes: entityType },
    }}
    fetchPolicy="network-only"
  >
    {({ loading, data, fetchMore, error, refetch }) => {
      if (error) {
        return error.message;
      }

      const nextPage = getByPathWithDefault(1, 'masks.page', data) + 1;
      const totalPage = getByPathWithDefault(1, 'masks.totalPage', data);
      const hasMore = nextPage <= totalPage;

      return (
        <div>
          <div className={CustomFieldsFormHeaderStyle}>
            <FormHeader
              name={<FormattedMessage id="modules.metadata.templates" defaultMessage="TEMPLATES" />}
            >
              <BooleanValue>
                {({ value: isOpen, set: toggle }) => (
                  <>
                    <NewButton onClick={() => toggle(true)} />
                    <SlideView
                      isOpen={isOpen}
                      onRequestClose={() => toggle(false)}
                      options={{ width: '1030px' }}
                    >
                      <MaskFormWrapper
                        entityType={entityType}
                        isNew
                        onSave={() => {
                          toggle(false);
                          refetch();
                        }}
                        onCancel={() => toggle(false)}
                      />
                    </SlideView>
                  </>
                )}
              </BooleanValue>
            </FormHeader>
          </div>
          <div className={CustomFieldsEditFormWrapperStyle}>
            <CustomFieldsTemplateGridView
              entityType={entityType}
              items={getByPathWithDefault([], 'masks.nodes', data)}
              onLoadMore={() => loadMore({ fetchMore, data }, { filterBy: entityType }, 'masks')}
              hasMore={hasMore}
              isLoading={loading}
              renderItem={mask => (
                <BooleanValue>
                  {({ value: isOpen, set: toggle }) => (
                    <>
                      <MetadataTemplateCard
                        key={mask.id}
                        metadataTemplate={mask}
                        onClick={() => {
                          toggle(true);
                        }}
                      />
                      <SlideView
                        isOpen={isOpen}
                        onRequestClose={() => toggle(false)}
                        options={{ width: '1030px' }}
                      >
                        <MaskFormWrapper
                          entityType={entityType}
                          id={mask.id}
                          onSave={() => {
                            toggle(false);
                            refetch();
                          }}
                          onCancel={() => toggle(false)}
                        />
                      </SlideView>
                    </>
                  )}
                </BooleanValue>
              )}
            />
          </div>
        </div>
      );
    }}
  </Query>
);

export default CustomFieldTemplateList;
