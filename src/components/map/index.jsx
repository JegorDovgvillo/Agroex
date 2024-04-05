import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router';
import _ from 'lodash';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import * as L from 'leaflet';
import markerIconUrl from '../../../node_modules/leaflet/dist/images/marker-icon.png';
import markerIconRetinaUrl from '../../../node_modules/leaflet/dist/images/marker-icon-2x.png';
import markerShadowUrl from '../../../node_modules/leaflet/dist/images/marker-shadow.png';

const STANDMAPS_API_KEY = import.meta.env.VITE_BASE_STANDMAPS_API_KEY;

import {
  fetchCountry,
  getCoordinate,
  getAddress,
} from '@thunks/fetchCountries';

import { setCountry } from '@slices/countriesSlice';
import { selectLotDetailById } from '@slices/lotListSlice';

import 'leaflet/dist/leaflet.css';

import styles from './map.module.scss';

const LocationMarker = ({ position, eventHandlers, draggable }) => {
  const map = useMapEvents({
    click() {
      map.flyTo([position.latitude, position.longitude], map.getZoom());
    },
  });

  L.Icon.Default.prototype.options.iconUrl = markerIconUrl;
  L.Icon.Default.prototype.options.iconRetinaUrl = markerIconRetinaUrl;
  L.Icon.Default.prototype.options.shadowUrl = markerShadowUrl;
  L.Icon.Default.imagePath = '';
  L.marker([45.0659, 7.67]).addTo(map);
  return (
    !_.isNil(position.latitude) &&
    !_.isNil(position.longitude) && (
      <Marker
        position={[position.latitude, position.longitude]}
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
  markerCoordinate,
  setMarkerCoordinate,
  selectedCountry,
  restrictFunctionallity,
}) => {
  const dispatch = useDispatch();
  const { id } = useParams();

  const selectedLot = useSelector((state) =>
    restrictFunctionallity ? null : selectLotDetailById(state, id)
  );
  const countryName = useSelector((state) =>
    restrictFunctionallity ? null : state.countries.countryName
  );
  const address = useSelector((state) =>
    restrictFunctionallity ? null : state.countries.address
  );

  const containerClass = restrictFunctionallity
    ? styles.itemCardMap
    : styles.mapContainer;

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
    if (countryName?.name && !disabledMap) {
      dispatch(getCoordinate({ countryName: countryName.name }));
    }
  }, [countryName]);

  useEffect(() => {
    if (markerCoordinate && !restrictFunctionallity) {
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
        address.city ||
        address.citytown ||
        address.borough ||
        address.village ||
        address.suburb;

      setFieldValue('region', region);
    }
  }, [address]);

  useEffect(() => {
    if (!selectedLot && !restrictFunctionallity) {
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

  return (
    <>
      {markerCoordinate ? (
        <div className={containerClass}>
          <MapContainer
            center={[markerCoordinate.lat, markerCoordinate.lon]}
            zoom={7}
            scrollWheelZoom={true}
            className={styles.map}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url={`https://tiles.stadiamaps.com/tiles/outdoors/{z}/{x}/{y}{r}.png?api_key=${STANDMAPS_API_KEY}`}
            />
            <LocationMarker
              position={{
                latitude: markerCoordinate.lat,
                longitude: markerCoordinate.lon,
              }}
              draggable={!restrictFunctionallity}
              eventHandlers={eventHandlers}
            />
          </MapContainer>
        </div>
      ) : (
        <div className={styles.errorMessageContainer}>
          <p>
            <ErrorOutlineIcon />
            Enable geolocation in your browser or select a country
          </p>
        </div>
      )}
    </>
  );
};

export default Map;
