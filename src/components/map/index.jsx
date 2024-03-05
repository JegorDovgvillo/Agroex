import {
  MapContainer,
  Popup,
  TileLayer,
  Marker,
  useMapEvents,
} from 'react-leaflet';
import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCountry } from '@thunks/fetchCountries';
import 'leaflet/dist/leaflet.css';

const LocationMarker = React.forwardRef(
  ({ latitude, longitude, handleClick, eventHandlers, draggable }, ref) => {
    const [position, setPosition] = useState([latitude, longitude]);
    const map = useMapEvents({
      click() {
        map.flyTo([latitude, longitude], map.getZoom());
      },
    });
    return (
      latitude &&
      longitude && (
        <Marker
          position={[latitude, longitude]}
          draggable={draggable}
          eventHandlers={eventHandlers}
          ref={ref}
        >
          <Popup minWidth={90}>
            <span onClick={handleClick}>
              {draggable
                ? 'Marker is draggable'
                : 'Click here to make marker draggable'}
            </span>
          </Popup>
        </Marker>
      )
    );
  }
);

const Map = ({ location }) => {
  const dispatch = useDispatch();
  const [draggable, setDraggable] = useState(false);
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const markerRef = useRef(null);

  const countryName = useSelector((state) => state.countries.countryName);

  useEffect(() => {
    if (location) {
      dispatch(fetchCountry(location));
    }
  }, [location]);

  useEffect(() => {
    if (countryName) {
      getCordinate(countryName.name).then(({ latitude, longitude }) => {
        setLatitude(latitude);
        setLongitude(longitude);
      });
    }
  }, [countryName]);
  useEffect(() => {
    if (latitude && longitude) {
      const url = `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`;

      fetch(url)
        .then((response) => response.json())
        .then((data) => {
          const address = data.display_name; // В этом примере берется поле display_name, которое содержит полный адрес
          console.log('Адрес:', address);
        })
        .catch((error) => {
          console.error('Ошибка при получении адреса:', error);
        });
    }
  }, [latitude, longitude]);

  const getCordinate = async (countryName) => {
    const url = `http://nominatim.openstreetmap.org/search?format=json&country=${encodeURIComponent(
      countryName
    )}`;

    try {
      const response = await fetch(url);
      const data = await response.json();

      if (data && data.length > 0) {
        const latitude = data[0].lat;
        const longitude = data[0].lon;

        return { latitude, longitude };
      }
    } catch (e) {
      console.log(e);
    }
  };

  const toggleDraggable = useCallback(() => {
    setDraggable((draggable) => !draggable);
  }, []);

  const eventHandlers = useMemo(
    () => ({
      dragend(e) {
        const marker = e.target;
        if (marker != null) {
          const newPosition = marker.getLatLng();

          setLatitude(newPosition.lat);
          setLongitude(newPosition.lng);
        }
      },
    }),
    []
  );

  return (
    <>
      {latitude && longitude && (
        <MapContainer
        boxZoom
          center={[latitude, longitude]}
          zoom={7}
          scrollWheelZoom={true}
          style={{ width: '100%', height: '400px' }}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <LocationMarker
            latitude={latitude}
            longitude={longitude}
            handleClick={toggleDraggable}
            eventHandlers={eventHandlers}
            draggable={draggable}
            ref={markerRef}
          />
        </MapContainer>
      )}
    </>
  );
};

export default Map;
