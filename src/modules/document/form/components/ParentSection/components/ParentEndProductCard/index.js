// @flow
import * as React from 'react';
import { navigate } from '@reach/router';
import { encodeId } from 'utils/id';
import { OrderProductProviderCard } from 'components/Cards';
import { useEntityHasPermissions } from 'contexts/Permissions';
import { PRODUCT_FORM } from 'modules/permission/constants/product';

type Props = {
  productProvider: Object,
};

const ParentEndProductCard = ({ productProvider }: Props) => {
  const hasPermissions = useEntityHasPermissions(productProvider?.product);

  return (
    <OrderProductProviderCard
      productProvider={productProvider}
      onClick={() => {
        if (hasPermissions(PRODUCT_FORM) && !!productProvider?.product?.id) {
          navigate(`/product/${encodeId(productProvider?.product?.id)}`);
        }
      }}
    />
  );
};

export default ParentEndProductCard;
