import api from "@/lib/api";
import {NextResponse} from "next/server";
import {ErrTokenNotMatch} from "@/lib/constance";

export async function POST() {
    try {
        const res = await api.post("/get_info");
        return NextResponse.json(res.data, {status: 200});
    } catch (error) {
        if (error.err === ErrTokenNotMatch) {
            return NextResponse.json(
                {success: false, error: error.err},
                {status: error.status || 401}
            );
        }

        return NextResponse.json(
            {success: false, error: error.message || "Internal Server Error"},
            {status: 500}
        );
    }
}
