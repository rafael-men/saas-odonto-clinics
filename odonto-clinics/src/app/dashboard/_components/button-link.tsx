'use client'

import { Button } from "@/components/ui/button"
import { LinkIcon, Check } from "lucide-react"
import { useState } from "react"

export function CopyLink({userId}: {userId: string}) {
    const [copied, setCopied] = useState(false)

    async function handleCopyLink() {
        await navigator.clipboard.writeText(`${process.env.NEXT_PUBLIC_BASE_URL}/clinica/${userId}`)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    return (
        <Button className="bg-black text-white gap-2" onClick={handleCopyLink}>
            {copied ? (
                <>
                    <Check className="h-5 w-5 text-green-400" />
                    <span className="text-sm">Link copiado!</span>
                </>
            ) : (
                <LinkIcon className="h-5 w-5"/>
            )}
        </Button>
    )
}
