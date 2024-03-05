import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import React, { useState, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { fetchCountry, getCordinate, getAddress } from '@thunks/fetchCountries';

import { updateCordinate } from '@slices/countriesSlice';

import 'leaflet/dist/leaflet.css';

const LocationMarker = ({ latitude, longitude, eventHandlers, draggable }) => {
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
      ></Marker>
    )
  );
};

const Map = ({ location, setFieldValue, countries }) => {
  const dispatch = useDispatch();
  const [draggable, setDraggable] = useState(true);

  const countryName = useSelector((state) => state.countries.countryName);
  const address = useSelector((state) => state.countries.address);
  const countryCordinate = useSelector(
    (state) => state.countries.countryCordinate
  );

  useEffect(() => {
    if (location) {
      dispatch(fetchCountry({ id: location }));
    }
  }, [location]);

  useEffect(() => {
    if (address && countryName !== address.county) {
      countryName === address.country
        ? null
        : countries.find((country) =>
            country.name === address.country
              ? setFieldValue('country', country.id)
              : null
          );
    }
  }, [address]);

  useEffect(() => {
    if (countryName) {
      dispatch(getCordinate({ countryName: countryName.name }));
    }
  }, [countryName]);

  useEffect(() => {
    if (countryCordinate) {
      dispatch(
        getAddress({
          latitude: countryCordinate.lat,
          longitude: countryCordinate.lon,
        })
      );
    }
  }, [countryCordinate]);

  useEffect(() => {
    if (address) {
      if (address.state) {
        setFieldValue('region', address.state);
      } else if (address.county) {
        setFieldValue('region', address.county);
      } else if (address.citytown || address.borough) {
        setFieldValue('region', address.citytown || address.borough);
      } else if (address.village || address.suburb) {
        setFieldValue('region', address.village || address.suburb);
      }
    }
  }, [address]);

  const eventHandlers = useMemo(
    () => ({
      dragend(e) {
        const marker = e.target;
        if (marker != null) {
          const newPosition = marker.getLatLng();

          dispatch(
            updateCordinate({ lat: newPosition.lat, lon: newPosition.lng })
          );
        }
      },
    }),
    []
  );

  // useEffect(() => {
  //   navigator.geolocation.getCurrentPosition(
  //     (position) => {
  //       const { latitude, longitude } = position.coords;
  //       console.log(position.coords);
  //       dispatch(updateCordinate({ lat: latitude, lon: longitude }));
  //     },
  //     (error) => {
  //       console.error('Ошибка при получении текущего местоположения:', error);
  //     }
  //   );
  // }, []);

  return (
    <>
      {countryCordinate && (
        <MapContainer
          center={[countryCordinate.lat, countryCordinate.lon]}
          zoom={7}
          scrollWheelZoom={true}
          style={{ width: '100%', height: '400px', fontFamily: 'sans-serif' }}
        >
          <TileLayer url="https://tiles.stadiamaps.com/tiles/outdoors/{z}/{x}/{y}{r}.png" />
          <LocationMarker
            latitude={countryCordinate.lat}
            longitude={countryCordinate.lon}
            eventHandlers={eventHandlers}
            draggable={draggable}
          />
        </MapContainer>
      )}
    </>
  );
};

export default Map;
