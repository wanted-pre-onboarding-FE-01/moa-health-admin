import { SyntheticEvent, Dispatch } from 'react';
import { SetterOrUpdater } from 'recoil';
import { IInquiryPeriodState } from 'states';
import dayjs, { Dayjs } from 'dayjs';
import memberData from 'data/step_data/member_data.json';
import { TPage, IMemberData } from './types.d';

export const converteDate = (assignedDay: Dayjs) => {
  const firstWeek = assignedDay.startOf('month').week();

  const dates: Dayjs[] = Array.from(
    { length: assignedDay.daysInMonth() + assignedDay.startOf('month').day() },
    (v, index) => assignedDay.startOf('year').week(firstWeek).startOf('week').add(index, 'day')
  );

  const init: Dayjs[][] = [];

  let rowIdx = -1;
  return dates.reduce((acc, cur, i) => {
    if (!(i % 7)) {
      acc.push([cur]);
      rowIdx += 1;
    } else {
      acc[rowIdx].push(cur);
    }
    return acc;
  }, init);
};

const init: IMemberData = memberData[0];

export const findRegistrationDate = (page: TPage, selectMemberStartDate: string) => {
  if (page === '회원 관리')
    return memberData.reduce((c, n) => (Date.parse(n.crt_ymdt) < Date.parse(c.crt_ymdt) ? n : c), init).crt_ymdt;
  return selectMemberStartDate;
};

export const dateInputValue = (date: string, idx: number) => {
  if (date)
    return idx
      ? dayjs(date).add(1, 'day').subtract(1, 's').format('YY-MM-DD HH:mm:ss')
      : dayjs(date).format('YY-MM-DD HH:mm:ss');
  return date;
};

export const onClickQuickBtn = (
  { currentTarget }: SyntheticEvent<EventTarget>,
  setInquiryPeriod: SetterOrUpdater<IInquiryPeriodState>,
  fixedToday: string,
  registrationDate: string
) => {
  if (!(currentTarget instanceof HTMLButtonElement)) return;

  const { name } = currentTarget.dataset;
  if (name === '오늘')
    setInquiryPeriod({
      startDate: dayjs(fixedToday).format('YYYY-MM-DD'),
      endDate: dayjs(fixedToday).format('YYYY-MM-DD'),
    });
  if (name === '일주일')
    setInquiryPeriod({
      startDate: dayjs(fixedToday).subtract(6, 'day').format('YYYY-MM-DD'),
      endDate: dayjs(fixedToday).format('YYYY-MM-DD'),
    });
  if (name === '전체')
    setInquiryPeriod({
      startDate: dayjs(registrationDate).format('YYYY-MM-DD'),
      endDate: dayjs(fixedToday).format('YYYY-MM-DD'),
    });
};

export const updatePeriod = (
  date: Dayjs,
  startDate: string,
  endDate: string,
  setInquiryPeriod: SetterOrUpdater<IInquiryPeriodState>,
  setIsOpenCalendar: Dispatch<React.SetStateAction<boolean>>
) => {
  if (!startDate && !endDate)
    setInquiryPeriod((prev) => ({
      ...prev,
      startDate: date.format('YYYY-MM-DD'),
    }));
  else if (startDate && !endDate) {
    if (dayjs(startDate).isAfter(dayjs(date))) {
      setInquiryPeriod((prev) => ({
        ...prev,
        startDate: date.format('YYYY-MM-DD'),
      }));
    } else {
      setInquiryPeriod((prev) => ({
        ...prev,
        endDate: date.format('YYYY-MM-DD'),
      }));
      setIsOpenCalendar(false);
    }
  } else if (startDate && endDate) setInquiryPeriod({ startDate: date.format('YYYY-MM-DD'), endDate: '' });
};

export const convertToColorDate = (date: Dayjs, assignedDay: Dayjs, startDate: string, endDate: string) => {
  const isOtherMonth = assignedDay.format('MM') !== date.format('MM');
  const isSelectedDate = date.isSame(dayjs(startDate), 'date') || date.isSame(dayjs(endDate), 'date');
  const betweenDate = dayjs(date).isBetween(startDate, endDate, 'day', '()');

  return { isOtherMonth, isSelectedDate, betweenDate };
};
