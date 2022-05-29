import dayjs from 'dayjs';

const GRAPH_STYLE = {
  weeklyGraphBar: {
    x: 'date',
    y: 'steps',
    barWidth: 10,
  },
  dayGraphBar: {
    x: 'time',
    y: 'steps',
  },
  dayGraphAxis: {
    tickFormat: (x: string) => dayjs(x, 'HH:mm:ss').get('hour'),
    fixLabelOverlap: true,
  },
  axis: {
    style: {
      axis: { stroke: 'gray' },
      tickLabels: {
        fontFamily: 'inherit',
        fontWeight: 100,
        letterSpacing: '1px',
        stroke: 'gray',
        fontSize: 10,
        marginBlock: '20px',
      },
    },
  },
  bar: {
    style: { data: { fill: '#4FADF7' } },
  },
};

export default GRAPH_STYLE;
