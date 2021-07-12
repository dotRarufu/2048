const Square = ({ i, value, newSquare }) => {
  const squareColors = {
    2: '555',
    4: 'f26161',
    8: 'f03939',
    16: 'ea0909',
    32: '9a0707',
    64: 'BCD2E8',
    128: '91BAD6',
    256: '73A5C6',
    512: '528AAE',
    1024: '2E5984',
    2048: '1aa260',
  };
  return (
    <div
      key={i}
      className={!newSquare ? `bg-${squareColors[value]} square` : 'square new'}
    >
      {value}
    </div>
  );
};

export default Square;
