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
    dispatch(fetchCountries({ existed: false }));
  }, []);

  useEffect(() => {
    setSelectedReportData(
      _.find(reportsData, { reportType: _.camelCase(selectedReportType) })
    );
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
                  units={_.map(reportsData, (report) =>
                    _.startCase(report.reportType)
                  )}
                  placeholder="Report type"
                  value={values.reportType}
                  wrappType="adminReportType"
                  fieldType="adminReportType"
                  errors={errors.reportType}
                  touched={touched.reportType}
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
                        errors={errors[field]}
                        touched={touched[field]}
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
                disabled={!isValid}
              />
            </Form>
          </div>
        </>
      )}
    </Formik>
  );
};

export default AdminReports;
