// @flow
import * as React from 'react';
import type { ProductProviderPackagePayload } from 'generated/graphql';
import { injectIntl, type IntlShape } from 'react-intl';
import { getByPath } from 'utils/fp';
import { ApplyButton } from 'components/Buttons';
import OutsideClickHandler from 'components/OutsideClickHandler';

type Props = {|
  intl: IntlShape,
  items: Array<ProductProviderPackagePayload>,
  selected: ProductProviderPackagePayload,
  onClose: () => void,
  onApply: (pkgId: string) => void,
|};

function PackageSelection({ intl, items, selected, onClose, onApply }: Props) {
  const [selectedId, setSelectedId] = React.useState(getByPath('id', selected));
  return (
    <OutsideClickHandler onOutsideClick={onClose}>
      <div>
        <select value={selectedId} name="packing" onChange={evt => setSelectedId(evt.target.value)}>
          {items.map(item => (
            <option key={getByPath('id', item)} value={getByPath('id', item)}>
              {getByPath('name', item) ||
                intl.formatMessage({
                  id: 'modules.ProductProviders.noPackageName',
                  defaultMessage: 'No package name',
                })}
            </option>
          ))}
        </select>
        <ApplyButton onClick={() => onApply(selectedId)} />
      </div>
    </OutsideClickHandler>
  );
}

export default injectIntl(PackageSelection);
