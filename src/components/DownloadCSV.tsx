import { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import ExtLink from "../components/ExtLink";
import useDownloadCSV from "../hooks/useDownloadCSV";
import s from "./DownloadCSV.module.scss";
import "react-datepicker/dist/react-datepicker.css";

const DownloadCSV = ({ address }: { address: string }) => {
  const [startDate, setStartDate] = useState<any>(new Date().setHours(0, 0, 0));
  const [endDate, setEndDate] = useState<any>(new Date());
  const csvData = useDownloadCSV(address, startDate, endDate);

  useEffect(() => {
    // setStartDate(startDate.setHours(0, 0, 0));
    if (startDate.valueOf() > endDate.valueOf()) {
      setStartDate(endDate.setHours(0, 0, 0));
    }
  }, [startDate, endDate]);

  return (
    <>
      <div className={s.dateWrapper}>
        <DatePicker
          className={s.dateComponent}
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
        <button className={s.csvButton} disabled={csvData?.href ? false : true}>
          Download CSV
        </button>
      </ExtLink>
    </>
  );
};

export default DownloadCSV;
