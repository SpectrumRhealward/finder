import { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import c from "classnames";
import ExtLink from "../components/ExtLink";
import useDownloadCSV from "../hooks/useDownloadCSV";
import s from "./DownloadCSV.module.scss";
import "../datepicker/DatePicker.scss";

const DownloadCSV = ({ address }: { address: string }) => {
  const [startDate, setStartDate] = useState<any>(new Date().setHours(0, 0, 0));
  const [endDate, setEndDate] = useState<any>(new Date());
  const csvData = useDownloadCSV(address, startDate, endDate);

  useEffect(() => {
    if (startDate.valueOf() > endDate.valueOf()) {
      setStartDate(endDate.setHours(0, 0, 0));
    }
  }, [startDate, endDate]);

  return (
    <>
      <section className={s.dateWrapper}>
        <div className={s.dateSelect}>
          <DatePicker
            className={c(s.dateComponent, s.startDateInput)}
            selected={startDate}
            onChange={date => setStartDate(date)}
          />
          ~
          <DatePicker
            className={s.dateComponent}
            selected={endDate}
            onChange={date => setEndDate(date)}
          />
        </div>
        <ExtLink href={csvData?.href} download={`${csvData?.children}.csv`}>
          <button
            className={s.csvButton}
            disabled={csvData?.href ? false : true}
          >
            Download CSV
          </button>
        </ExtLink>
      </section>
    </>
  );
};

export default DownloadCSV;
