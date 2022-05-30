import styles from './dashboard.module.scss';
import DetailMember from 'routes/detailMember';

const Dashboard = () => {
  return (
    <div className={styles.dashboardWrapper}>
      <DetailMember />
    </div>
  );
};

export default Dashboard;
