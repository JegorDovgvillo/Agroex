import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Form, Formik } from 'formik';
import _ from 'lodash';
import { DateTime } from 'luxon';

import CustomSelect from '@customSelect';
import CustomDatePicker from '@components/customDatePicker';
import { reportsData } from '@components/admin/adminReports/reportsData';
import { CustomButton } from '@buttons/CustomButton';

import { countrySelector } from '@slices/countriesSlice';
import { fetchCountries } from '@thunks/fetchCountries';
import { fetchReport } from '@thunks/fetchReports';

import { adminReportsValidationSchema } from '@helpers/validationSchemes/adminReportsValidationSchema';
import {
  getCorrectedTimeZone,
  setCorrectedTimeZone,
} from '@helpers/getCorrectTime';

import styles from './adminReports.module.scss';

const { row } = styles;

const defaultStatDate = '2000-01-01T00:00:01.647Z';

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
  const [isFirstSubmit, setIsFirstSubmit] = useState(true);

  const handleSubmit = (values) => {
    const { reportType, actualStartDate, expirationDate, lotType, countryId } =
      values;

    const params = {
      actualStartDate: setCorrectedTimeZone(actualStartDate, userInfo.zoneinfo),
      expirationDate: setCorrectedTimeZone(expirationDate, userInfo.zoneinfo),
      lotType: _.camelCase(lotType),
      countryId: _.find(countries, { name: countryId })?.id || null,
    };
    const reportTypeToSubmit = _.find(reportsData, {
      name: reportType,
    })?.reportType;

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

  const handleClick = () => {
    if (!isFirstSubmit) return;

    setIsFirstSubmit(false);
  };

  useEffect(() => {
    dispatch(fetchCountries({ existed: false }));
  }, []);

  useEffect(() => {
    setSelectedReportData(_.find(reportsData, { name: selectedReportType }));
  }, [selectedReportType]);

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={adminReportsValidationSchema}
      onSubmit={handleSubmit}
    >
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
                  units={_.map(reportsData, 'name')}
                  placeholder="Report type"
                  value={values.reportType}
                  wrappType="adminReportType"
                  fieldType="adminReportType"
                  errors={errors.reportType}
                  touched={!isFirstSubmit || touched.reportType}
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
                    setFieldTouched('actualStartDate', true);
                    setFieldValue('actualStartDate', date);
                  }}
                  errors={errors.actualStartDate}
                  touched={touched.actualStartDate}
                />
                <CustomDatePicker
                  label="End date"
                  value={values.expirationDate}
                  onChange={(date) => {
                    setFieldTouched('expirationDate', true);
                    setFieldValue('expirationDate', date);
                  }}
                  errors={errors.expirationDate}
                  touched={touched.expirationDate}
                />
              </div>
              <div className={row}>
                <CustomSelect
                  label="Lot type"
                  id="lotType"
                  name="lotType"
                  wrappType="adminReportType"
                  fieldType="adminReportType"
                  units={getUnits('lotType')}
                  placeholder="Select lot type"
                  value={values.lotType}
                  errors={errors.lotType}
                  touched={touched.lotType}
                  setFieldValue={setFieldValue}
                />
                {_.includes(selectedReportData.reportFields, 'countryId') &&
                  countries && (
                    <CustomSelect
                      label="Country"
                      id="countryId"
                      name="countryId"
                      wrappType="adminReportType"
                      fieldType="adminReportType"
                      units={getUnits('countryId')}
                      placeholder="Select country"
                      value={values.countryId}
                      errors={errors.countryId}
                      touched={touched.countryId}
                      setFieldValue={setFieldValue}
                    />
                  )}
              </div>

              <CustomButton
                text="Get report"
                width="auto"
                typeOfButton="submit"
                handleClick={handleClick}
                disabled={!isValid && !isFirstSubmit}
              />
            </Form>
          </div>
        </>
      )}
    </Formik>
  );
};

export default AdminReports;
