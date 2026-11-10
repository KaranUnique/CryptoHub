import React from 'react';
import { useCryptoList } from '../hooks/useCryptoList';
import { isFavorite } from '../utils/favorites';

const Watchlist = () => {
  const { cryptoList } = useCryptoList();

  return (
    <div className="watchlist">
      <h1>Watchlist</h1>
      <ul>
        {cryptoList.filter(crypto => isFavorite(crypto.id)).map(crypto => (
          <li key={crypto.id}>{crypto.name}</li>
        ))}
      </ul>
    </div>
  );
}

export default Watchlist;

