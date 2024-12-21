import {
  PieChart,
  Pie,
  Sector,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Rectangle,
  ResponsiveContainer,
  LineChart,
  Line,
  Legend,
  LabelList,
} from 'recharts';
import { useState, useCallback, useEffect } from 'react';

import useApi from '../hooks/useApi';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const renderActiveShape = (props) => {
  const RADIAN = Math.PI / 180;
  const {
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    startAngle,
    endAngle,
    fill,
    payload,
    percent,
    value,
  } = props;
  const sin = Math.sin(-RADIAN * midAngle);
  const cos = Math.cos(-RADIAN * midAngle);
  const sx = cx + (outerRadius + 10) * cos;
  const sy = cy + (outerRadius + 10) * sin;
  const mx = cx + (outerRadius + 30) * cos;
  const my = cy + (outerRadius + 30) * sin;
  const ex = mx + (cos >= 0 ? 1 : -1) * 22;
  const ey = my;
  const textAnchor = cos >= 0 ? 'start' : 'end';

  return (
    <g>
      <text
        x={cx}
        y={cy}
        dy={8}
        textAnchor="middle"
        fill={payload.color || fill}
      >
        {payload.name}
      </text>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={payload.color || fill}
      />
      <Sector
        cx={cx}
        cy={cy}
        startAngle={startAngle}
        endAngle={endAngle}
        innerRadius={outerRadius + 6}
        outerRadius={outerRadius + 10}
        fill={payload.color || fill}
      />
      <path
        d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`}
        stroke={payload.color || fill}
        fill="none"
      />
      <circle
        cx={ex}
        cy={ey}
        r={2}
        fill={payload.color || fill}
        stroke="none"
      />
      <text
        x={ex + (cos >= 0 ? 1 : -1) * 12}
        y={ey}
        textAnchor={textAnchor}
        fill={payload.color || '#333'}
      >{`العدد : ${value}`}</text>
      <text
        x={ex + (cos >= 0 ? 1 : -1) * 12}
        y={ey}
        dy={18}
        textAnchor={textAnchor}
        fill={payload.color || '#999'}
      >
        {`(نسبة ${(percent * 100).toFixed(2)}%)`}
      </text>
    </g>
  );
};

const Statistics = () => {
  const [scoutsStatistics, setScoutsStatistics] = useState([]);
  const [transactionsStatistics, setTransactionsStatistics] = useState([]);
  const [eventsAttendanceStatistics, setEventsAttendanceStatistics] = useState(
    []
  );
  const [maxAttendance, setMaxAttendance] = useState(0);
  const apiRequest = useApi();

  const [activeIndex, setActiveIndex] = useState(0);
  const onPieEnter = useCallback(
    (_, index) => {
      setActiveIndex(index);
    },
    [setActiveIndex]
  );

  useEffect(() => {
    const fetchScoutsStatistics = async () => {
      return await apiRequest({
        url: 'http://localhost:3000/api/statistics/rank',
        method: 'GET',
      });
    };
    const fetchTransactionsStatistics = async () => {
      return await apiRequest({
        url: 'http://localhost:3000/api/statistics/transactions',
        method: 'GET',
      });
    };
    const fetchEventsAttendanceStatistics = async () => {
      return await apiRequest({
        url: 'http://localhost:3000/api/statistics/events',
        method: 'GET',
      });
    };

    const fetchData = async () => {
      try {
        const [
          scoutsStatisticsfetch,
          transactionsStatisticsfetch,
          eventsAttendanceStatisticsfetch,
        ] = await Promise.all([
          fetchScoutsStatistics(),
          fetchTransactionsStatistics(),
          fetchEventsAttendanceStatistics(),
        ]);
        const maxCount = Math.max(
          ...eventsAttendanceStatisticsfetch.data.map((event) => event.count)
        );
        setMaxAttendance(maxCount);
        setScoutsStatistics(
          scoutsStatisticsfetch.data.map((item, index) => ({
            ...item,
            color: COLORS[index],
          }))
        );
        setTransactionsStatistics(transactionsStatisticsfetch.data);
        setEventsAttendanceStatistics(eventsAttendanceStatisticsfetch.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, [apiRequest]);

  return (
    <>
      <h2
        className="mb-4 text-2xl font-bold"
        style={{ color: 'var(--secondary-color)' }}
      >
        قائمة الإحصائيات
      </h2>
      <div className="min-h-screen grid grid-cols-1 md:grid-cols-2 gap-10">
        <div className="bg-white-100 p-4 shadow-md rounded-md" dir="ltr">
          <h3 className="text-lg font-semibold mb-2"> الكشافة</h3>
          <PieChart width={400} height={400}>
            <Pie
              activeIndex={activeIndex}
              activeShape={renderActiveShape}
              data={scoutsStatistics}
              cx={200}
              cy={200}
              innerRadius={60}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
              onMouseEnter={onPieEnter}
            />
          </PieChart>
        </div>
        <div
          className="bg-white-100 p-4 shadow-md rounded-md flex flex-col justify-center"
          dir="ltr"
        >
          <h3 className="text-lg font-semibold mb-2">معاملات العام الحالي</h3>
          <ResponsiveContainer width={'100%'} height={300}>
            <BarChart
              data={transactionsStatistics}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar
                dataKey="Withdraw"
                fill="#8884d8"
                activeBar={<Rectangle fill="pink" stroke="blue" />}
              />
              <Bar
                dataKey="Deposit"
                fill="#82ca9d"
                activeBar={<Rectangle fill="gold" stroke="purple" />}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-white-100 p-4 shadow-md rounded-md" dir="ltr">
          <h3 className="text-lg font-semibold mb-2">إحصائيات الغياب</h3>
          <ResponsiveContainer width={'100%'} height={300}>
            <LineChart data={eventsAttendanceStatistics} margin={{ top: 20 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="Ename" padding={{ left: 30, right: 30 }} />
              <YAxis
                allowDecimals={false} // Ensures that only integer ticks are generated
                domain={[0, maxAttendance + 2]}
              />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="count" stroke="#82ca9d">
                <LabelList position="top" offset={10} />
              </Line>
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </>
  );
};

export default Statistics;
