
import {
  useState,
  useCallback,
  useMemo,
  useReducer,
  useEffect,
} from 'react';

import useFetchPhotos from './hooks/useFetchPhotos';
import favouritesReducer from './favouritesReducer';

function App() {
  const { photos, loading, error } = useFetchPhotos();

  const [search, setSearch] = useState('');

  const [favourites, dispatch] = useReducer(
    favouritesReducer,
    [],
    () => {
      try {
        const saved = localStorage.getItem('favourites');
        return saved ? JSON.parse(saved) : [];
      } catch {
        return [];
      }
    }
  );

  const handleSearch = useCallback((event) => {
    setSearch(event.target.value);
  }, []);

  useEffect(() => {
    localStorage.setItem('favourites', JSON.stringify(favourites));
  }, [favourites]);

  const filteredPhotos = useMemo(() => {
    return photos.filter((photo) =>
      photo.author.toLowerCase().includes(search.toLowerCase())
    );
  }, [photos, search]);

  const toggleFavourite = (photoId) => {
    dispatch({
      type: 'TOGGLE_FAVOURITE',
      payload: photoId,
    });
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-lg font-semibold">Loading photos...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center text-red-600">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6">
      <h1 className="mb-6 text-center text-3xl font-bold">
        Photo Gallery
      </h1>

      <div className="mx-auto mb-8 max-w-md">
        <input
          type="text"
          placeholder="Search by author name..."
          value={search}
          onChange={handleSearch}
          className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 outline-none focus:border-blue-500"
        />
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {filteredPhotos.map((photo) => {
          const isFavourite = favourites.includes(photo.id);

          return (
            <div
              key={photo.id}
              className="overflow-hidden rounded-xl bg-white shadow-md"
            >
              <img
                src={photo.download_url}
                alt={`Photo by ${photo.author}`}
                className="h-56 w-full object-cover"
              />

              <div className="flex items-center justify-between p-4">
                <p className="font-semibold">{photo.author}</p>

                <button
                  type="button"
                  onClick={() => toggleFavourite(photo.id)}
                  aria-label={
                    isFavourite
                      ? 'Remove from favourites'
                      : 'Add to favourites'
                  }
                  aria-pressed={isFavourite}
                  className={`text-2xl ${
                    isFavourite ? 'text-red-500' : 'text-gray-400'
                  }`}
                >
                  {isFavourite ? '♥' : '♡'}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {filteredPhotos.length === 0 && (
        <p className="mt-8 text-center text-gray-500">
          No photos found.
        </p>
      )}
    </div>
  );
}

export default App;
