import { memo } from 'react';

/**
 * Елемент списку для демонстрації React.memo.
 * У консолі видно, чи перемальовується рядок при зміні стейту батька.
 */
const DemoListItem = ({ title, id, onLike }) => {
  if (process.env.NODE_ENV === 'development') {
    // eslint-disable-next-line no-console
    console.log(`DemoListItem (${title}) відрендерився`);
  }

  return (
    <div
      style={{
        padding: '8px 12px',
        marginBottom: 6,
        border: '1px solid #ddd',
        borderRadius: 6,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}
    >
      <span>{title}</span>
      <button type="button" onClick={() => onLike(id)}>
        Like
      </button>
    </div>
  );
};

export default memo(DemoListItem);
