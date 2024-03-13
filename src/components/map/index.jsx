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
import {
  setCountry,
  updateMarkerCoordinate,
} from '../../store/slices/countriesSlice';

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

const Map = ({
  location,
  setFieldValue,
  countries,
  setDisabledMap,
  disabledMap,
}) => {
  const dispatch = useDispatch();
  const { id } = useParams();

  const [draggable, setDraggable] = useState(true);

  const selectedLot = useSelector((state) => selectLotDetailById(state, id));
  const countryName = useSelector((state) => state.countries.countryName);
  const address = useSelector((state) => state.countries.address);
  const countryCoordinate = useSelector(
    (state) => state.countries.countryCoordinate
  );
  const markerCoordinate = useSelector(
    (state) => state.countries.markerCoordinate
  );

  useEffect(() => {
    if (location && !disabledMap) {
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
    } else if (
      countryName &&
      selectedLot &&
      address &&
      countryName !== address.country
    ) {
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
        dispatch(
          updateMarkerCoordinate({
            lat: latitude,
            lon: longitude,
          })
        );
        dispatch(updateCoordinate({ lat: latitude, lon: longitude }));
      });
    } else if (selectedLot) {
      dispatch(
        updateCoordinate({
          lat: selectedLot.location.latitude,
          lon: selectedLot.location.longitude,
        })
      );
      dispatch(
        updateMarkerCoordinate({
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

          setDisabledMap(true);
          dispatch(
            updateMarkerCoordinate({
              lat: newPosition.lat,
              lon: newPosition.lng,
            })
          );
        }
      },
    }),
    []
  );

  return (
    <>
      {countryCoordinate && markerCoordinate && (
        <div className={styles.mapContainer}>
          <MapContainer
            center={[countryCoordinate.lat, countryCoordinate.lon]}
            zoom={7}
            scrollWheelZoom={true}
            className={styles.map}
          >
            <TileLayer url="https://tiles.stadiamaps.com/tiles/outdoors/{z}/{x}/{y}{r}.png" />
            <LocationMarker
              latitude={markerCoordinate.lat}
              longitude={markerCoordinate.lon}
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
