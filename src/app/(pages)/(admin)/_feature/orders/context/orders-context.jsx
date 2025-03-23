"use client";

import {createContext, useContext, useState} from "react";

const OrdersContext = createContext({
    open: false,
    setOpen: () => {},
    editData: null,
    setEditData: () => {},
    isEdit: false,
    setIsEdit: () => {},
    isInvite: false,
    setIsInvite: () => {},
    isDelete: false,
    setIsDelete: () => {},
    deleteId: null,
    setDeleteId: () => {},
    assignDialogOpen: false,
    setAssignDialogOpen: () => {},
    orderToAssign: null,
    setOrderToAssign: () => {},
    rejectDialogOpen: false,
    setRejectDialogOpen: () => {},
    orderToReject: null,
    setOrderToReject: () => {},
    updateStatusDialogOpen: false,
    setUpdateStatusDialogOpen: () => {},
    orderToUpdate: null,
    setOrderToUpdate: () => {},
});

export const useOrdersContext = () => {
    return useContext(OrdersContext);
};

export default function OrdersProvider({children}) {
    const [open, setOpen] = useState(false);
    const [editData, setEditData] = useState(null);
    const [isEdit, setIsEdit] = useState(false);
    const [isInvite, setIsInvite] = useState(false);
    const [isDelete, setIsDelete] = useState(false);
    const [deleteId, setDeleteId] = useState(null);
    const [assignDialogOpen, setAssignDialogOpen] = useState(false);
    const [orderToAssign, setOrderToAssign] = useState(null);
    const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
    const [orderToReject, setOrderToReject] = useState(null);
    const [updateStatusDialogOpen, setUpdateStatusDialogOpen] = useState(false);
    const [orderToUpdate, setOrderToUpdate] = useState(null);

    return (
        <OrdersContext.Provider
            value={{
                open,
                setOpen,
                editData,
                setEditData,
                isEdit,
                setIsEdit,
                isInvite,
                setIsInvite,
                isDelete,
                setIsDelete,
                deleteId,
                setDeleteId,
                assignDialogOpen,
                setAssignDialogOpen,
                orderToAssign,
                setOrderToAssign,
                rejectDialogOpen,
                setRejectDialogOpen,
                orderToReject,
                setOrderToReject,
                updateStatusDialogOpen,
                setUpdateStatusDialogOpen,
                orderToUpdate,
                setOrderToUpdate,
            }}
        >
            {children}
        </OrdersContext.Provider>
    );
}
