import Image from "next/image";
import { Poppins } from "next/font/google";
import { cn } from "@/lib/utils";

const font = Poppins({
    subsets: ["latin"],
    weight: ["200", "300", "400", "500", "600", "700", "800"]
});

export const Logo = () => {
    return(
        <div className="flex flex-col items-center gap-y-1">
            <div className="bg-white rounded-full p-1">
            <Image
            src="/pizza.svg" 
            alt="Logo"
            height="80"
            width="80"
            />
            </div>
            <div className="flex flex-col items-center">
                <p className={cn(
                    "text-xl font-extrabold text-white",
                    font.className
                )}>
                    LiveAdda
                </p>
            </div>
        </div>
    )
}