import { useContext } from 'react';
import { ArtistsContext } from '../context/ArtistsContext';

export const useArtists = () => {
  const context = useContext(ArtistsContext);
  if (!context) {
    throw new Error('useArtists must be used within an ArtistsProvider');
  }
  return context;
};

export default useArtists;
