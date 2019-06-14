// @flow
import * as React from 'react';
import { navigate } from '@reach/router';
import { Query } from 'react-apollo';
import { getByPathWithDefault } from 'utils/fp';
import LoadingIcon from 'components/LoadingIcon';

import { allCustomFieldDefinitionsQuery } from './query';

type OptionalProps = {
  onCompleted: Function,
};

type Props = OptionalProps & {
  render: Function,
};

const QueryForAllCustomFieldDefinitions = ({ render, onCompleted }: Props) => (
  <Query query={allCustomFieldDefinitionsQuery} fetchPolicy="cache-first" onCompleted={onCompleted}>
    {({ error, data, loading }) => {
      if (error) {
        if (error.message && error.message.includes('403')) {
          navigate('/403');
        }

        return error.message;
      }

      if (loading) return <LoadingIcon />;
      if (data) {
        const orderCustomFields = getByPathWithDefault([], 'order', data);
        const orderItemCustomFields = getByPathWithDefault([], 'orderItem', data);
        const batchCustomFields = getByPathWithDefault([], 'batch', data);
        const shipmentCustomFields = getByPathWithDefault([], 'shipment', data);
        const productCustomFields = getByPathWithDefault([], 'product', data);
        return render({
          orderCustomFields,
          orderItemCustomFields,
          batchCustomFields,
          shipmentCustomFields,
          productCustomFields,
        });
      }
      return <LoadingIcon />;
    }}
  </Query>
);

QueryForAllCustomFieldDefinitions.defaultProps = {
  onCompleted: () => {},
};

export default QueryForAllCustomFieldDefinitions;
