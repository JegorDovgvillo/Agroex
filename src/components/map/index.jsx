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

import { setCountry } from '@slices/countriesSlice';
import { selectLotDetailById } from '@slices/lotListSlice';

import 'leaflet/dist/leaflet.css';

import styles from './map.module.scss';

const LocationMarker = ({ latitude, longitude, eventHandlers }) => {
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
        draggable={true}
        eventHandlers={eventHandlers}
      ></Marker>
    )
  );
};

const Map = ({
  location,
  setFieldValue,
  countries,
  setDisabledMap,
  disabledMap,
  markerCoordinate,
  setMarkerCoordinate,
  selectedCountry,
}) => {
  const dispatch = useDispatch();
  const { id } = useParams();

  const selectedLot = useSelector((state) => selectLotDetailById(state, id));
  const countryName = useSelector((state) => state.countries.countryName);
  const address = useSelector((state) => state.countries.address);

  useEffect(() => {
    if (location && !disabledMap) {
      dispatch(fetchCountry({ id: location }));
    } else if (location && disabledMap && address) {
      const foundCountry = _.find(countries, { name: address.country });

      dispatch(setCountry(foundCountry));
    }
  }, [location]);

  useEffect(() => {
    if (address) {
      const foundCountry = _.find(countries, { name: address.country });

      foundCountry && setFieldValue('country', foundCountry.id);
    }
  }, [address]);

  useEffect(() => {
    if (selectedCountry) {
      setMarkerCoordinate({
        lat: selectedCountry.lat,
        lon: selectedCountry.lon,
      });
    }
  }, [selectedCountry]);

  useEffect(() => {
    if (countryName.name && !disabledMap) {
      dispatch(getCoordinate({ countryName: countryName.name }));
    }
  }, [countryName]);

  useEffect(() => {
    if (markerCoordinate) {
      dispatch(
        getAddress({
          latitude: markerCoordinate.lat,
          longitude: markerCoordinate.lon,
        })
      );
    }
  }, [markerCoordinate]);

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

        setMarkerCoordinate({
          lat: latitude,
          lon: longitude,
        });
      });
    } else if (selectedLot) {
      setMarkerCoordinate({
        lat: selectedLot.location.latitude,
        lon: selectedLot.location.longitude,
      });
    }
  }, []);

  const eventHandlers = useMemo(
    () => ({
      dragend(e) {
        const marker = e.target;

        if (marker != null) {
          const newPosition = marker.getLatLng();

          setDisabledMap(true);
          setMarkerCoordinate({
            lat: newPosition.lat,
            lon: newPosition.lng,
          });
        }
      },
    }),
    []
  );

  return (
    <>
      {markerCoordinate && (
        <div className={styles.mapContainer}>
          <MapContainer
            center={[markerCoordinate.lat, markerCoordinate.lon]}
            zoom={7}
            scrollWheelZoom={true}
            className={styles.map}
          >
            <TileLayer url="https://tiles.stadiamaps.com/tiles/outdoors/{z}/{x}/{y}{r}.png" />
            <LocationMarker
              latitude={markerCoordinate.lat}
              longitude={markerCoordinate.lon}
              eventHandlers={eventHandlers}
            />
          </MapContainer>
        </div>
      )}
    </>
  );
};

export default Map;
