import {columns} from "./components/orders-columns";
import {OrdersDialog} from "./components/orders-dialogs";
import {OrdersPrimaryButtons} from "./components/orders-primary-buttons";
import {OrdersTable} from "./components/orders-table";
import OrdersProvider from "./context/orders-context";
import {orderListSchema} from "./data/schema";
import {orders} from "./data/orders";

export default function Orders() {
    // Parse order list
    const orderList = orderListSchema.parse(orders);

    return (
        <OrdersProvider>
            <div className="mb-2 flex flex-wrap items-center justify-between space-y-2">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Order List</h2>
                </div>
            </div>
            <div className="-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0">
                <OrdersTable data={orderList} columns={columns} />
            </div>

            <OrdersDialog />
        </OrdersProvider>
    );
}
