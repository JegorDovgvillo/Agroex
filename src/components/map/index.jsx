import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import React, { useState, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router';

import { fetchCountry, getCordinate, getAddress } from '@thunks/fetchCountries';

import { updateCordinate } from '@slices/countriesSlice';
import { selectLotDetailById } from '@slices/lotListSlice';

import 'leaflet/dist/leaflet.css';
import _ from 'lodash';

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
  const { id } = useParams();

  const [draggable, setDraggable] = useState(true);
  const [isTouched, setIsTouched] = useState(false);

  const selectedLot = useSelector((state) => selectLotDetailById(state, id));
  const countryName = useSelector((state) => state.countries.countryName);
  const address = useSelector((state) => state.countries.address);
  const countryCordinate = useSelector(
    (state) => state.countries.countryCordinate
  );

  useEffect(() => {
    if (location && isTouched) {
      dispatch(fetchCountry({ id: location }));
    }
  }, [location]);

  useEffect(() => {
    if (address && countryName !== address.country) {
      const foundCountry = _.find(
        countries,
        (country) => country.name === address.country
      );
      foundCountry && setFieldValue('country', foundCountry.id);
    }
  }, [address]);

  useEffect(() => {
    if (countryName && !selectedLot) {
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

  useEffect(() => {
    if (!selectedLot) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        dispatch(updateCordinate({ lat: latitude, lon: longitude }));
      });
    } else {
      dispatch(
        updateCordinate({
          lat: selectedLot.location.latitude,
          lon: selectedLot.location.longitude,
        })
      );
    }
  }, []);

  const eventHandlers = useMemo(
    () => ({
      dragend(e) {
        const marker = e.target;

        if (marker != null) {
          const newPosition = marker.getLatLng();

          setIsTouched(true);
          dispatch(
            updateCordinate({ lat: newPosition.lat, lon: newPosition.lng })
          );
        }
      },
    }),
    []
  );

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
