// @flow
import { css } from 'react-emotion';
import { colors, presets, layout, fontSizes } from 'styles/common';

type ScrollType = {
  height: string,
};

export const ScrollWrapperStyle = ({ height }: ScrollType) => css`
  height: calc(100vh - 220px);
  width: 100%;
  ${height &&
    `
    height: ${height};
  `};
  overflow-y: auto;
  background-color: ${colors.GRAY_SUPER_LIGHT};
  padding-left: 20px;
`;

export const FilterLayoutStyle = css`
  display: grid;
  grid-template-columns: minmax(120px, 3fr) minmax(250px, 7fr) 10fr;
  height: inherit;
  overflow: hidden;
`;

export const FilterSectionTabs = css`
  padding: 20px;
  ${layout.GRID_VERTICAL};
  grid-row-gap: 10px;
`;

export const FilteredNoStyle = css`
  height: 20px;
  line-height: 20px;
  padding: 0 10px;
  width: fit-content;
  background-color: #cccccc;
  -webkit-border-radius: 999px;
  -moz-border-radius: 999px;
  border-radius: 999px;
  color: ${colors.WHITE};
`;

export const FilterGroupSectionWrapperStyle = css``;

export const FilterGroupSectionStyle: string = css`
  display: grid;
  grid-template-columns: 1fr;
  grid-auto-columns: min-content;
  grid-row-gap: 10px;
  padding: 20px 10px 10px 20px;
  margin-bottom: 2px;
  background-color: ${colors.ALMOST_WHITE};
`;

export const FilterSectionStyle: string = css`
  width: 100%;
  display: grid;
  grid-auto-flow: column;
  grid-auto-columns: 1fr min-content;
  grid-gap: 5px;
  align-items: center;
`;

export const FilterSectionEditForm = css`
  height: inherit;
  overflow: auto;
  padding-top: 20px;
  padding-left: 20px;
`;

export const FilterSectionLabel = css`
  ${fontSizes.MEDIUM};
  ${presets.ELLIPSIS};
  letter-spacing: 2px;
  user-select: none;
  padding: 0 5px;
`;

export const FilterTagStyle = css`
  height: 20px;
  line-height: 20px;
  padding: 0 8px;
  ${fontSizes.SMALL};
  width: fit-content;
  background-color: ${colors.GRAY_LIGHT};
  color: ${colors.WHITE};
  border-radius: 999px;
  font-weight: bold;
  margin-right: 6px;
  margin-bottom: 3px;
`;

export const FilterTagsWrapperStyle = css`
  display: flex;
  flex-flow: row wrap;
`;

export default null;
