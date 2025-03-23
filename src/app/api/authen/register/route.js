import pubApi from "@/lib/pubApi";
import {NextResponse} from "next/server";

export async function POST(request) {
    const params = await request.json();
    try {
        const res = await pubApi.post("/register", params);
        return NextResponse.json(res.data);
    } catch (error) {
        if (error.err) {
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
