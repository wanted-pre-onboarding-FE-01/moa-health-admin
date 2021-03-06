import { VictoryChart, VictoryLine, VictoryAxis, VictoryLabel } from 'victory';
import heartRateData from '../../../data/heartrate_data/heartrate_data_total.json';
import getDatesFromStartToLast from '../../../utils/getDatesFromStartToLast';
import { IHeartRate } from 'types/heartRate';

import styles from './heartRateDataGraph.module.scss';
import GRAPH_STYLE from './GRAPH_STYLE';
import { DatePicker } from 'components';
import WhiteSection from 'components/whiteSection';
import { useRecoilValue } from 'recoil';
import { inquiryPeriodHeartState } from 'states';

const HeartRateDataGraph = ({ selectedID }: { selectedID: number }) => {
  const userId = selectedID;
  const date = useRecoilValue(inquiryPeriodHeartState);
  const rawData = heartRateData.find((el) => el.id === userId);
  const userHeartRateData = rawData?.heartRateData ?? [];
  const array: IHeartRate[] = [];

  const selectedDateArray = getDatesFromStartToLast(date.startDate, date.endDate).map((dateEl) =>
    userHeartRateData?.filter((el) => el.crt_ymdt.substr(0, 10) === dateEl && dateEl)
  );

  const filteredDataArray = selectedDateArray?.filter((el) => el.length > 0);
  filteredDataArray.map((el) => {
    if (el.length > 0) {
      for (let j = 0; j < el.length; j += 1) {
        array.push(el[j]);
      }
    }
    return array;
  });

  const averageHeartBeat = array.reduce((acc: number, curr: IHeartRate) => acc + curr.avg_beat, 0) / array.length;

  const data = array?.map((el: IHeartRate) => {
    return { x: el.crt_ymdt, y: el.avg_beat };
  });

  const setTickFormat = (tick: string) => {
    const datesArray = getDatesFromStartToLast(date.startDate, date.endDate);
    if (array.length > 0) {
      if (datesArray.length >= 2) {
        return tick.substr(0, 10);
      }
      return tick.substr(10, 6);
    }
    return '';
  };

  return (
    <WhiteSection>
      <>
        <div className={styles.heartRate}>
          <h3 className={styles.dataAverage}>
            <span>심박수</span> 평균 {!isNaN(Number(averageHeartBeat)) ? Math.floor(averageHeartBeat) : 0} bpm
          </h3>
          <DatePicker page='회원 상세 정보' state={inquiryPeriodHeartState} />
        </div>
        <VictoryChart minDomain={{ y: 50 }} maxDomain={{ y: 160 }} width={900}>
          <VictoryLine
            style={{
              data: { stroke: '#4FADF7' },
            }}
            sortOrder='descending'
            data={data}
            animate={GRAPH_STYLE.animate}
          />
          <VictoryAxis dependentAxis style={GRAPH_STYLE.styleAxisY} />
          <VictoryAxis
            tickFormat={(tick) => setTickFormat(tick)}
            fixLabelOverlap
            tickLabelComponent={<VictoryLabel renderInPortal />}
            style={GRAPH_STYLE.styleAxisX}
          />
        </VictoryChart>
      </>
    </WhiteSection>
  );
};

export default HeartRateDataGraph;
