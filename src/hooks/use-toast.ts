// Simplified version of use-toast for avoiding errors if not present
// In a real app this would be the full shadcn implementation

import { useState } from "react"

export function useToast() {
    const [toasts, setToasts] = useState<any[]>([])

    const toast = ({ title, description, variant }: any) => {
        console.log(`Toast: ${title} - ${description} (${variant})`)
        // Just a stub, no UI
    }

    return { toast }
}
