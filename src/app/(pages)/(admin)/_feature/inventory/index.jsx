import {columns} from "./components/inventory-columns";
import {InventoryTable} from "./components/inventory-table";
import {getAllInventoryItems} from "./data/service";
import {inventoryListSchema} from "./data/schema";

export default function Inventory() {
    // Parse inventory list
    const inventoryList = inventoryListSchema.parse(getAllInventoryItems());

    return (
        <>
            <div className="mb-2 flex flex-wrap items-center justify-between space-y-2">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Inventory List</h2>
                    <p className="text-muted-foreground">
                        Manage your inventory items and stock levels
                    </p>
                </div>
            </div>
            <div className="-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0">
                <InventoryTable data={inventoryList} columns={columns} />
            </div>
        </>
    );
}
