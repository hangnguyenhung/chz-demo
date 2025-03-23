"use client";

import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {Button} from "@/components/ui/button";
import {CheckCheck, CircleSlash2, Edit, KeyRound, Loader2, Plus, Trash} from "lucide-react";
import axios from "axios";
import {useMutation, useQuery} from "@tanstack/react-query";
import {useState} from "react";
import {EditAccountDialog} from "./edit-account-dialog";
import {toast} from "sonner";
import {CreateAccountDialog} from "./create-account-dialog";
import {TooltipWrap} from "@/components/tooltip-wrap";
import {ResetPasswordDialog} from "./reset-password-dialog";
import {ErrString} from "@/lib/constance";
import {BaseDialog} from "@/components/base-dialog";

export function AccountsTable() {
    const [openActiveDialogOpen, setOpenActiveDialogOpen] = useState(false);
    const [openEditDialogOpen, setOpenEditDialogOpen] = useState(false);
    const [openInactiveDialogOpen, setOpenInactiveDialogOpen] = useState(false);
    const [openCreateDialogOpen, setOpenCreateDialogOpen] = useState(false);
    const [openResetPasswordDialogOpen, setOpenResetPasswordDialogOpen] = useState(false);

    const [accountSelected, setAccountSelected] = useState(null);

    //----------------------------------------------
    const {data, isLoading, refetch} = useQuery({
        queryKey: ["account"],
        queryFn: async () => {
            const params = {
                email: "",
                username: "",
                phone_number: "",
                sort_field: "username",
                sort_order: "ASC",
            };
            const response = await axios.post("/api/account/list", params);
            return response.data.profile || [];
        },
        refetchOnWindowFocus: false,
        retry: false,
    });

    // --------------------------------------------------

    const {mutateAsync, isPending} = useMutation({
        mutationFn: async (username) => {
            const response = await axios.post("/api/account/active", {username});
            return response.data;
        },
        onSuccess: () => {
            refetch();
            toast.success("Account activated successfully");
        },
        onError: (error) => {
            toast.error(ErrString[error.response.data.error] || "Error");
        },
    });

    const handleActivate = async (username) => {
        await mutateAsync(username);
        setOpenActiveDialogOpen(false);
        setAccountSelected(null);
    };

    // --------------------------------------------------

    const handleUpdateAccount = async (data) => {
        await updateAccount(data);
    };

    const {mutateAsync: updateAccount, isPending: isUpdatePending} = useMutation({
        mutationFn: async (params) => {
            const response = await axios.post("/api/account/update", params);
            return response.data;
        },
        onSuccess: () => {
            refetch();
            setOpenEditDialogOpen(false);
            toast.success("Account updated successfully");
        },
        onError: (error) => {
            toast.error(ErrString[error.response.data.error] || "Error");
        },
    });

    // --------------------------------------------------

    const handleInactive = async (username) => {
        await inactiveAccount(username);
    };

    const {mutateAsync: inactiveAccount, isPending: isInactivePending} = useMutation({
        mutationFn: async (username) => {
            const response = await axios.post("/api/account/inactive", {username});
            return response.data;
        },
        onSuccess: () => {
            refetch();
            setOpenInactiveDialogOpen(false);
            toast.success("Account inactivated successfully");
        },
        onError: (error) => {
            toast.error(ErrString[error.response.data.error] || "Error");
        },
    });

    // --------------------------------------------------

    const handleCreateAccount = async (data) => {
        await createAccount(data);
    };

    const {mutateAsync: createAccount, isPending: isCreatePending} = useMutation({
        mutationFn: async (params) => {
            const response = await axios.post("/api/authen/register", params);
            return response.data;
        },
        onSuccess: () => {
            refetch();
            setOpenCreateDialogOpen(false);
            toast.success("Account created successfully");
        },
        onError: (error) => {
            toast.error(ErrString[error.response.data.error] || "Error");
        },
    });

    // --------------------------------------------------
    //reset password

    const handleResetPassword = async (data) => {
        await resetPassword(data);
    };

    const {mutateAsync: resetPassword, isPending: isResetPending} = useMutation({
        mutationFn: async (params) => {
            const response = await axios.post("/api/account/reset-password", params);
            return response.data;
        },
        onSuccess: () => {
            setOpenResetPasswordDialogOpen(false);
            toast.success("Password reset successfully");
        },
        onError: (error) => {
            toast.error(ErrString[error.response.data.error] || "Error");
        },
    });

    return isLoading ? (
        <Loader2 className="animate-spin" />
    ) : (
        <>
            <div className="mb-2 flex justify-end gap-2">
                <Button onClick={() => setOpenResetPasswordDialogOpen(true)}>
                    <KeyRound className="mr- h-4 w-4" />
                    Reset Password
                </Button>
                <Button onClick={() => setOpenCreateDialogOpen(true)}>
                    <Plus className="mr- h-4 w-4" />
                    Create Account
                </Button>
            </div>
            <Table>
                <TableCaption>List of current accounts.</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead>Email</TableHead>
                        <TableHead>Username</TableHead>
                        <TableHead>Display Name</TableHead>
                        <TableHead>Phone Number</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data?.map((account) => (
                        <TableRow key={account.email}>
                            <TableCell>{account.email}</TableCell>
                            <TableCell>{account.username}</TableCell>
                            <TableCell>{account.display_name}</TableCell>
                            <TableCell>{account.phone_number}</TableCell>
                            <TableCell>{account.account_type}</TableCell>
                            <TableCell>{account.status}</TableCell>
                            <TableCell className="text-right">
                                <TooltipWrap desc="Edit">
                                    <Button
                                        variant="outline"
                                        className="mr-2"
                                        size="sm"
                                        onClick={() => {
                                            setAccountSelected(account);
                                            setOpenEditDialogOpen(true);
                                        }}
                                    >
                                        <Edit className="h-4 w-4" />
                                    </Button>
                                </TooltipWrap>
                                {account.status === "inactive" && (
                                    <TooltipWrap desc="Activate Account">
                                        <Button
                                            className="mr-2"
                                            size="sm"
                                            onClick={() => {
                                                setAccountSelected(account);
                                                setOpenActiveDialogOpen(true);
                                            }}
                                        >
                                            <CheckCheck className="h-4 w-4" />
                                        </Button>
                                    </TooltipWrap>
                                )}
                                <TooltipWrap desc="Inactivate">
                                    <Button
                                        variant="destructive"
                                        size="sm"
                                        onClick={() => {
                                            setAccountSelected(account);
                                            setOpenInactiveDialogOpen(true);
                                        }}
                                    >
                                        <CircleSlash2 className="h-4 w-4" />
                                    </Button>
                                </TooltipWrap>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
                <TableFooter>
                    <TableRow>
                        <TableCell colSpan={7} className="text-right">
                            Total accounts: {data?.length}
                        </TableCell>
                    </TableRow>
                </TableFooter>
            </Table>
            <BaseDialog
                title="Activate Account"
                open={openActiveDialogOpen}
                onOpenChange={setOpenActiveDialogOpen}
                onSave={() => handleActivate(accountSelected.username)}
                isLoading={isPending}
            >
                <div className="grid gap-2 py-4">
                    <p>Do you want to activate this account?</p>
                    <strong>{accountSelected?.email}</strong>
                </div>
            </BaseDialog>
            <EditAccountDialog
                title="Edit Account"
                open={openEditDialogOpen}
                onOpenChange={setOpenEditDialogOpen}
                onSave={handleUpdateAccount}
                account={accountSelected}
                isLoading={isUpdatePending}
            >
                <div className="grid gap-4 py-4"></div>
            </EditAccountDialog>
            <BaseDialog
                title="Inactivate Account"
                open={openInactiveDialogOpen}
                onOpenChange={setOpenInactiveDialogOpen}
                onSave={() => handleInactive(accountSelected.username)}
                isLoading={isInactivePending}
            >
                <div className="grid gap-2 py-4">
                    <p>Do you want to inactivate this account?</p>
                    <strong>{accountSelected?.email}</strong>
                </div>
            </BaseDialog>
            <CreateAccountDialog
                title="Create New Account"
                open={openCreateDialogOpen}
                onOpenChange={setOpenCreateDialogOpen}
                onSave={handleCreateAccount}
                isLoading={isCreatePending}
            />
            <ResetPasswordDialog
                title="Reset Password"
                open={openResetPasswordDialogOpen}
                onOpenChange={setOpenResetPasswordDialogOpen}
                onSave={handleResetPassword}
                isLoading={isResetPending}
            />
        </>
    );
}
