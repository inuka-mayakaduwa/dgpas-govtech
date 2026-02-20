import Link from 'next/link';
import { Button } from '@/components/ui/button';

export function Navbar() {
    return (
        <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-14 items-center justify-between mx-auto px-4">
                <div className="flex items-center gap-6">
                    <Link href="/" className="font-bold text-lg">
                        Digital Permit System
                    </Link>
                    <div className="flex gap-4">
                        <Link href="/" className="text-sm font-medium transition-colors hover:text-primary">
                            Apply
                        </Link>
                        <Link href="/status" className="text-sm font-medium transition-colors hover:text-primary">
                            Check Status
                        </Link>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Link href="/admin">
                        <Button variant="outline" size="sm">Admin Login</Button>
                    </Link>
                </div>
            </div>
        </nav>
    );
}
