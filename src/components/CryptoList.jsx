import { useState, useEffect } from 'react';
import { saveToFavorites, removeFromFavorites, isFavorite } from '../utils/favorites';

const CryptoList = () => {
  const [favorites, setFavorites] = useState([]);
        isFavorite={isFavorite(crypto.id, favorites)}
        onFavoriteClick={() => {
          if (isFavorite(crypto.id, favorites)) {
            removeFromFavorites(crypto.id, setFavorites);
          } else {
            saveToFavorites(crypto.id, setFavorites);
          }
        }}

