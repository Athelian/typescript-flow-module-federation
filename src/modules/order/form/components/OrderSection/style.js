// @flow
import { css } from 'react-emotion';

export const WrapperStyle = css`
  min-width: min-content;
  min-height: min-content;
  background: #fff;
  padding: 40px 100px;
`;

export const FormWrapperStyle = css`
  display: flex;
`;

export const ExporterSectionStyle = css`
  flex: 1;
  display: flex;
  justify-content: center;
`;

export const InputsWrapperStyle = css`
  flex: 2;
`;

export const ExporterCardStyle = css`
  width: 200px;
  height: 230px;
  cursor: pointer;
  img {
    border-radius: 5px 5px 0 0;
    width: 100%;
    height: 200px;
    object-fit: cover;
  }
  div {
    text-align: center;
  }
`;
