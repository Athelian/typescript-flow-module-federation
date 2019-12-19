// @flow
import * as React from 'react';
import { navigate } from '@reach/router';
import { encodeId } from 'utils/id';
import { OrderProductProviderCard } from 'components/Cards';
import { useEntityHasPermissions } from 'contexts/Permissions';
import { PRODUCT_PROVIDER_FORM } from 'modules/permission/constants/product';

type Props = {
  productProvider: Object,
};

const ParentEndProductCard = ({ productProvider }: Props) => {
  const hasPermissions = useEntityHasPermissions(productProvider);

  return (
    <OrderProductProviderCard
      productProvider={productProvider}
      onClick={() => {
        if (hasPermissions(PRODUCT_PROVIDER_FORM) && !!productProvider?.id) {
          navigate(`/product/${encodeId(productProvider?.product?.id)}`);
        }
      }}
    />
  );
};

export default ParentEndProductCard;
