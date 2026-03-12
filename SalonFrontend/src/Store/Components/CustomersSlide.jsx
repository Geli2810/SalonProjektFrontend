import {useDispatch, useSelector} from "react-redux";
import {useEffect} from "react";
import {fetchCustomers} from "../../Store/Slices/CustomersSlice";

const CustomersSlide = () => {
    const dispatch = useDispatch();
    const customers = useSelector((state) => state.customers.customers);
    const status = useSelector((state) => state.customers.status);
    const error = useSelector((state) => state.customers.error);

    useEffect(() => {
        if (status === 'idle') {
            dispatch(fetchCustomers());
        }
    }, [dispatch, status]);

    if (status === 'loading') {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    ///here it is where we will display the customers in a list, you can customize this as needed
    return (
        <div>
            <h2>Customers</h2>
            <ul>
                {customers.map((customer) => (
                    <li key={customer.kundeId}>{customer.navn} {customer.telefon}</li>
                ))}
            </ul>

   
        </div>
    );
}
export default CustomersSlide;