import { useGetAllTransactionsQuery } from '../../redux/transactionApi';
import Chart from '../../components/Chart';

const Statistics = () => {
    const { data } = useGetAllTransactionsQuery();

    return (
        <div>
            <Chart transactions={data?.result ?? []} />
        </div>
    );
};

export default Statistics;
