// @flow
import * as React from 'react';
import { Link } from '@reach/router';
import Icon from 'components/Icon';
import { Display } from 'components/Form';
import { WrapperStyle, IconColorStyle } from './style';

type Props = {|
  entity: string,
  value: React$Node,
  blackout?: boolean,
  link: string,
  width: string,
|};

const defaultProps = {
  width: '145px',
  link: '',
};

export default function RelateEntity({ entity, value, blackout, link, width }: Props) {
  const isNotAvailable = blackout || !value;

  let entityColor = entity;
  if (entity === 'IMPORTER' || entity === 'EXPORTER') entityColor = 'PARTNER';

  return (
    <div className={WrapperStyle(width)}>
      {link && !isNotAvailable ? (
        <Link
          className={IconColorStyle(entityColor, isNotAvailable)}
          to={link}
          onClick={evt => {
            evt.stopPropagation();
          }}
        >
          <Icon icon={entity} />
        </Link>
      ) : (
        <div className={IconColorStyle(entityColor, isNotAvailable)}>
          <Icon icon={entity} />
        </div>
      )}
      <Display height="20px" align="left" blackout={blackout}>
        {value}
      </Display>
    </div>
  );
}

RelateEntity.defaultProps = defaultProps;
