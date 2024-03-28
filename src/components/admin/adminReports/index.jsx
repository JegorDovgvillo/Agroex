import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Form, Formik } from 'formik';
import _ from 'lodash';
import { DateTime } from 'luxon';

import Paper from '@mui/material/Paper';

import CustomSelect from '@customSelect';
import CustomDatePicker from '@components/customDatePicker';
import { CustomButton } from '@buttons/CustomButton';

import { countrySelector } from '@slices/countriesSlice';
import { fetchCountries } from '@thunks/fetchCountries';
import { fetchReport } from '@thunks/fetchReport';

import {
  getCorrectedTimeZone,
  setCorrectedTimeZone,
} from '@helpers/getCorrectTime';

import styles from './adminReports.module.scss';

const { row, datesRow } = styles;

const reportsData = [
  {
    id: 0,
    reportType: 'baseLot',
    description:
      'Returns the list of lots according to the selected parameters',
    reportFields: ['actualStartDate', 'expirationDate', 'lotType', 'countryId'],
  },
  {
    id: 1,
    reportType: 'lotByMaxPrice',
    description: 'Returns 10 lots with highest price',
    reportFields: ['actualStartDate', 'expirationDate', 'lotType', 'countryId'],
  },
  {
    id: 2,
    reportType: 'userByLotCount',
    description: 'Returns 10 users with max amount',
    reportFields: ['actualStartDate', 'expirationDate', 'lotType', 'countryId'],
  },
  {
    id: 3,
    reportType: 'ownersByBets',
    description: 'Returns 10 users with max sum of bets on their lots',
    reportFields: ['actualStartDate', 'expirationDate', 'lotType', 'countryId'],
  },
  {
    id: 4,
    reportType: 'participantsByBets',
    description: 'Returns 10 users with max sum of bets on lots',
    reportFields: ['actualStartDate', 'expirationDate', 'lotType', 'countryId'],
  },
  {
    id: 5,
    reportType: 'countryByLotPrice',
    description: 'Returns 10 countries with max sum of lot prices',
    reportFields: ['actualStartDate', 'expirationDate', 'lotType'],
  },
  {
    id: 6,
    reportType: 'countryByLotCount',
    description: ' Returns 10 countries with max count of lots',
    reportFields: ['actualStartDate', 'expirationDate', 'lotType'],
  },
  {
    id: 7,
    reportType: 'countryByOwnersLotsBets',
    description: 'Returns 10 countries with max count of lot owners',
    reportFields: ['actualStartDate', 'expirationDate', 'lotType'],
  },
  {
    id: 8,
    reportType: 'countryByParticipantBets',
    description:
      'Returns 10 countries with max sum of bets on lots by owners with highest sum of bets on their lots',
    reportFields: ['actualStartDate', 'expirationDate', 'lotType'],
  },
  {
    id: 9,
    reportType: 'countryByParticipantCount',
    description: 'Returns 10 countries with max count of lots participants',
    reportFields: ['actualStartDate', 'expirationDate', 'lotType'],
  },
  {
    id: 10,
    reportType: 'countryByOwnersLotsBets',
    description: 'Returns 10 countries with max sum of bets by participants',
    reportFields: ['actualStartDate', 'expirationDate', 'lotType'],
  },
];

const defaultStatDate = '2000-01-02T02:00:01.647Z';

const AdminReports = () => {
  const dispatch = useDispatch();

  const userInfo = useSelector((state) => state.usersList.userInfo);

  const dateNow = getCorrectedTimeZone(DateTime.now(), userInfo?.zoneinfo);
  const startDate = setCorrectedTimeZone(defaultStatDate, userInfo?.zoneinfo);
  const countries = useSelector(countrySelector);

  const initialValues = {
    reportType: null,
    actualStartDate: startDate,
    expirationDate: dateNow,
    lotType: null,
    countryId: null,
  };
  const [selectedReportType, setSelectedReportType] = useState(
    initialValues.reportType
  );
  const [selectedReportData, setSelectedReportData] = useState(null);

  const handleSubmit = (values) => {
    const { reportType, actualStartDate, expirationDate, lotType, countryId } =
      values;

    const params = {
      actualStartDate: setCorrectedTimeZone(actualStartDate, userInfo.zoneinfo),
      expirationDate: setCorrectedTimeZone(expirationDate, userInfo.zoneinfo),
      lotType: _.camelCase(lotType),
      countryId: _.find(countries, { name: countryId })?.id || null,
    };
    const reportTypeToSubmit = _.camelCase(reportType);

    dispatch(fetchReport({ reportType: reportTypeToSubmit, params }));
    return;
  };

  const getUnits = (field) => {
    switch (field) {
      case 'lotType':
        return ['Buy', 'Sell', 'Auction sell'];

      case 'countryId':
        return _.map(countries, 'name');
    }
  };

  useEffect(() => {
    dispatch(fetchCountries({ existed: true }));
  }, []);

  useEffect(() => {
    setSelectedReportData(
      _.find(reportsData, { reportType: _.camelCase(selectedReportType) })
    );
  }, [selectedReportType]);
  //console.log(initialValues);
  return (
    <Formik initialValues={initialValues} onSubmit={handleSubmit}>
      {({
        values,
        errors,
        touched,
        isValid,
        setFieldValue,
        setFieldTouched,
      }) => (
        <>
          <div>
            <Form>
              <div className={row}>
                <CustomSelect
                  label="Report type"
                  id="reportType"
                  name="reportType"
                  required
                  units={_.map(reportsData, (report) =>
                    _.startCase(report.reportType)
                  )}
                  placeholder="Report type"
                  value={values.reportType}
                  wrappType="adminReportType"
                  fieldType="adminReportType"
                  // errors={errors.reportType}
                  //touched={!isCreateNotSubmittedForm || touched.lotType}
                  handleChange={setSelectedReportType}
                  setFieldValue={setFieldValue}
                />
                <div>{selectedReportData?.description}</div>
              </div>

              <div className={row}>
                <CustomDatePicker
                  label="Start date"
                  value={values.actualStartDate}
                  onChange={(date) => {
                    //setFieldTouched('actualStartDate', true);
                    setFieldValue('actualStartDate', date);
                  }}
                  //errors={errors.expirationDate}
                  //touched={
                  //  !isCreateNotSubmittedForm || touched.expirationDate
                  //}
                />
                <CustomDatePicker
                  label="End date"
                  value={values.expirationDate}
                  onChange={(date) => {
                    // setFieldTouched('expirationDate', true);
                    setFieldValue('expirationDate', date);
                  }}
                  // errors={errors.expirationDate}
                  //touched={
                  //  !isCreateNotSubmittedForm || touched.expirationDate
                  //}
                />
              </div>
              <div className={row}>
                {selectedReportData?.reportFields?.map((field) => (
                  <div key={field}>
                    {!_.includes(
                      ['actualStartDate', 'expirationDate'],
                      field
                    ) && (
                      <CustomSelect
                        label={_.startCase(field)}
                        id={field}
                        name={field}
                        units={getUnits(field)}
                        placeholder={_.startCase(field)}
                        value={values[field]}
                        //errors={errors.lotType}
                        //touched={!isCreateNotSubmittedForm || touched.lotType}
                        //handleChange={setSelectedLotType}
                        setFieldValue={setFieldValue}
                      />
                    )}
                  </div>
                ))}
              </div>

              <CustomButton
                text="Get report"
                width="auto"
                typeOfButton="submit"
              />
            </Form>
          </div>
        </>
      )}
    </Formik>
  );
};

export default AdminReports;
