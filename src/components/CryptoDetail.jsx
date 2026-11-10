import { useState, useEffect } from 'react';
import { saveToFavorites, removeFromFavorites, isFavorite } from '../utils/favorites';

const CryptoDetail = () => {
  const [favorites, setFavorites] = useState([]);
        <button
          onClick={() => {
            if (isFavorite(crypto.id, favorites)) {
              removeFromFavorites(crypto.id, setFavorites);
            } else {
              saveToFavorites(crypto.id, setFavorites);
            }
          }}
        >
          {isFavorite(crypto.id, favorites) ? 'Remove from Favorites' : 'Add to Favorites'}
        </button>

