import React, { useCallback, useMemo, useState } from 'react';
import { StyledRating, StyledRatingItem } from '../styled';

export const Rating = ({ value, onChange }) => {
  const [hoveredRating, setHoveredRating] = useState(0);
  const parsedValue = useMemo(() => parseInt(value), [value]);
  const handleChange = useCallback(
    (value: number) => () => {
      onChange(value === 1 ? '0' : value.toString());
    },
    [onChange],
  );

  return (
    <StyledRating>
      <StyledRatingItem
        $active={parsedValue > 0 || hoveredRating > 0}
        onClick={handleChange(1)}
        onMouseEnter={() => setHoveredRating(1)}
        onMouseLeave={() => setHoveredRating(0)}
      />
      <StyledRatingItem
        $active={parsedValue > 1 || hoveredRating > 1}
        onClick={handleChange(2)}
        onMouseEnter={() => setHoveredRating(2)}
        onMouseLeave={() => setHoveredRating(0)}
      />
      <StyledRatingItem
        $active={parsedValue > 2 || hoveredRating > 2}
        onClick={handleChange(3)}
        onMouseEnter={() => setHoveredRating(3)}
        onMouseLeave={() => setHoveredRating(0)}
      />
      <StyledRatingItem
        $active={parsedValue > 3 || hoveredRating > 3}
        onClick={handleChange(4)}
        onMouseEnter={() => setHoveredRating(4)}
        onMouseLeave={() => setHoveredRating(0)}
      />
      <StyledRatingItem
        $active={parsedValue > 4 || hoveredRating > 4}
        onClick={handleChange(5)}
        onMouseEnter={() => setHoveredRating(5)}
        onMouseLeave={() => setHoveredRating(0)}
      />
    </StyledRating>
  );
};
