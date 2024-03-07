import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import React, { useState, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router';
import _ from 'lodash';

import {
  fetchCountry,
  getCoordinate,
  getAddress,
} from '@thunks/fetchCountries';

import { updateCoordinate } from '@slices/countriesSlice';
import { selectLotDetailById } from '@slices/lotListSlice';

import 'leaflet/dist/leaflet.css';

import styles from './map.module.scss';

const LocationMarker = ({ latitude, longitude, eventHandlers, draggable }) => {
  const map = useMapEvents({
    click() {
      map.flyTo([latitude, longitude], map.getZoom());
    },
  });

  return (
    !_.isNil(latitude) &&
    !_.isNil(longitude) && (
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
  const countryCoordinate = useSelector(
    (state) => state.countries.countryCoordinate
  );

  useEffect(() => {
    if (location && isTouched) {
      dispatch(fetchCountry({ id: location }));
    }
  }, [location]);

  useEffect(() => {
    if (address && countryName !== address.country) {
      const foundCountry = _.find(countries, { name: address.country });

      foundCountry && setFieldValue('country', foundCountry.id);
    }
  }, [address]);

  useEffect(() => {
    if (countryName && !selectedLot) {
      dispatch(getCoordinate({ countryName: countryName.name }));
    }
  }, [countryName]);

  useEffect(() => {
    if (countryCoordinate) {
      dispatch(
        getAddress({
          latitude: countryCoordinate.lat,
          longitude: countryCoordinate.lon,
        })
      );
    }
  }, [countryCoordinate]);

  useEffect(() => {
    if (address) {
      const region =
        address.state ||
        address.county ||
        address.citytown ||
        address.borough ||
        address.village ||
        address.suburb;

      setFieldValue('region', region);
    }
  }, [address]);

  useEffect(() => {
    if (!selectedLot) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;

        dispatch(updateCoordinate({ lat: latitude, lon: longitude }));
      });
    } else {
      dispatch(
        updateCoordinate({
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
            updateCoordinate({ lat: newPosition.lat, lon: newPosition.lng })
          );
        }
      },
    }),
    []
  );

  return (
    <>
      {countryCoordinate && (
        <div className={styles.mapContainer}>
          <MapContainer
            center={[countryCoordinate.lat, countryCoordinate.lon]}
            zoom={7}
            scrollWheelZoom={true}
            className={styles.map}
          >
            <TileLayer url="https://tiles.stadiamaps.com/tiles/outdoors/{z}/{x}/{y}{r}.png" />
            <LocationMarker
              latitude={countryCoordinate.lat}
              longitude={countryCoordinate.lon}
              eventHandlers={eventHandlers}
              draggable={draggable}
            />
          </MapContainer>
        </div>
      )}
    </>
  );
};

export default Map;
