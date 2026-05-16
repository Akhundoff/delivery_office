import styled from 'styled-components';

const Selection = styled.div`
    padding-left: 12px;

    & > [role='icon'] {
        margin-right: 6px;
    }
`;

const StyledActionBarWithoutStatic = styled.div<{ $flex?: boolean; $visible?: boolean }>`
    display: ${({ $flex, $visible = true }) => ($visible ? ($flex ? 'flex' : 'block') : 'none')};
    justify-content: space-between;
    align-items: center;
    flex: 1;

    & > *:not(:last-child) {
        margin-right: 8px;
    }
`;

const StyledActionBar = StyledActionBarWithoutStatic as typeof StyledActionBarWithoutStatic & {
    Selection: typeof Selection;
};

StyledActionBar.Selection = Selection;

export { StyledActionBar };
