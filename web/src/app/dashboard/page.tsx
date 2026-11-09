"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { UserRole } from "@/types/user.types";

export default function DashboardPage() {
    const router = useRouter();

    const { data: session, isPending } = authClient.useSession();

    useEffect(() => {
        if (isPending) return;

        if (!session?.user) {
            router.replace("/sign-in");
            return;
        }

        const role = (
            session.user as typeof session.user & {
                role: UserRole;
            }
        ).role;

        switch (role) {
            case "ADMIN":
                router.replace("/dashboard/admin");
                break;

            case "PLAYER":
                router.replace("/dashboard/player");
                break;

            case "COACH":
                router.replace("/dashboard/coach");
                break;
            case "REFEREE":
                router.replace("/dashboard/referee");
                break;
            case "OWNER":
                router.replace("/dashboard/owner");
                break;

            default:
                router.replace("/sign-in");
        }
    }, [isPending, session, router]);

    return (
        <div className="flex min-h-screen items-center justify-center">
            <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
    );
}