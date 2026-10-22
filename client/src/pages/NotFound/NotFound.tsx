import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div style={{ padding: '80px 20px', textAlign: 'center', fontFamily: 'sans-serif' }}>
      <h1 style={{ fontSize: 48, fontWeight: 700, marginBottom: 8 }}>404</h1>
      <p style={{ color: '#666', marginBottom: 24 }}>页面不存在</p>
      <Link
        to="/"
        style={{
          padding: '8px 24px',
          borderRadius: 8,
          border: '1px solid #ccc',
          background: '#fff',
          textDecoration: 'none',
          color: '#333',
        }}
      >
        返回首页
      </Link>
    </div>
  );
};

export default NotFound;
