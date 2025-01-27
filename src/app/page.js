import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center">
            <main>Hi Splitties</main>
            <Link href={"/create"}>
                <Button>Create room</Button>
            </Link>
        </div>
    );
}
